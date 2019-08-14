module Feed
  # This is the Investors Exchange API handler.
  ################################################
  # See the bottom of this file for sample data. #
  ################################################
  class IEX
    # Makes data request for an array of symbols.
    # Returns array of results.
    def self.latest_trades(symbols)
      ###
      ### Don't allow an empty symbol list. IEX will pass back all symbols and use a lot of message count.
      ###
      symbols.map do |symbol|
        begin
          Rails.logger.debug "IEX PRICE FETCH BEGIN for: #{symbol}."
          resp = Faraday.get("https://cloud.iexapis.com/stable/stock/#{symbol}/quote?token=#{iex_key}")
          Rails.logger.debug "IEX PRICE FETCH END   for: #{symbol}."
          response = JSON.parse(resp.body)
        rescue Faraday::ClientError => e
          Rails.logger.error "IEX PRICE FETCH ERROR: Faraday client error: #{e}."
          Feed.error_trade(symbol, 'The feed is down.')
        rescue JSON::ParserError => e
          Rails.logger.error "IEX PRICE FETCH ERROR: JSON parse error: #{e}."
          Feed.error_trade(symbol, 'The feed is down.')
        else
          process_price_response(response)
        end
      end
    end

    # Return the IEX Trading API key.
    private_class_method def self.iex_key
      @@api_key ||= ENV['RAILS_ENV'] == 'test' ? nil : ENV['IEX_API_KEY']
    end

    # Return the feed's list of valid symbols.
    def self.symbology
      begin
        conn = Faraday.new(url: 'https://cloud.iexapis.com/stable/ref-data/region/US/symbols')
      rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
        Rails.logger.error "IEX SYMBOLOGY FETCH ERROR: Faraday client error: #{e}."
        {}
      else
        begin
          Rails.logger.debug 'IEX SYMBOLOGY FETCH BEGIN.'
          resp = conn.get do |req|
            req.params['token']   = iex_key
          end
          Rails.logger.debug 'IEX SYMBOLOGY FETCH END.'
          JSON.parse(resp.body)
        rescue Faraday::ClientError => e
          Rails.logger.error "IEX SYMBOLOGY FETCH ERROR: Faraday client error: #{e}."
          {}
        rescue JSON::ParserError => e
          Rails.logger.error "IEX SYMBOLOGY FETCH ERROR: JSON parse error: #{e}."
          {}
        end
      end
    end

    ### private ###

    # Extract trade data or an error from the response.
    private_class_method def self.process_price_response(response)
      fetch_time = DateTime.now
      response.keys.map do |symbol|
        symbol_quote = response[symbol]['quote']
        if symbol_quote.nil?
          Feed.error_trade(symbol, 'Price is not available.')
        else
          # TODO: Need proper timezone info.
          # TODO: Consider not using a Trade here. It looks like it's causing an unecessary Instrument lookup. We only need the symbol.
          #       On the other hand, then the caller would need to work with raw live data when updating the corresponding trade.
          Trade.new do |t|
            t.instrument   = Instrument.find_by(symbol: symbol)
            t.trade_date   = Time.at(symbol_quote['latestUpdate'].to_f / 1000.0).round(4).to_datetime
            t.trade_price  = symbol_quote['latestPrice'].to_f.round(4)
            t.price_change = symbol_quote['change'].to_f.round(4)
            t.created_at   = fetch_time
          end
        end
      end
    end

    ###################
    ##  SAMPLE DATA  ##
    ###################
    #
    # Quote:
    # https://cloud.iexapis.com/stable/stock/AAPL/quote?token=#{iex_key}
    # {
    #   "symbol": "AAPL",
    #   "companyName": "Apple Inc.",
    #   "calculationPrice": "tops",
    #   "open": 154,
    #   "openTime": 1506605400394,
    #   "close": 153.28,
    #   "closeTime": 1506605400394,
    #   "high": 154.80,
    #   "low": 153.25,
    #   "latestPrice": 158.73,
    #   "latestSource": "Previous close",
    #   "latestTime": "September 19, 2017",
    #   "latestUpdate": 1505779200000,
    #   "latestVolume": 20567140,
    #   "iexRealtimePrice": 158.71,
    #   "iexRealtimeSize": 100,
    #   "iexLastUpdated": 1505851198059,
    #   "delayedPrice": 158.71,
    #   "delayedPriceTime": 1505854782437,
    #   "extendedPrice": 159.21,
    #   "extendedChange": -1.68,
    #   "extendedChangePercent": -0.0125,
    #   "extendedPriceTime": 1527082200361,
    #   "previousClose": 158.73,
    #   "change": -1.67,
    #   "changePercent": -0.01158,
    #   "iexMarketPercent": 0.00948,
    #   "iexVolume": 82451,
    #   "avgTotalVolume": 29623234,
    #   "iexBidPrice": 153.01,
    #   "iexBidSize": 100,
    #   "iexAskPrice": 158.66,
    #   "iexAskSize": 100,
    #   "marketCap": 751627174400,
    #   "week52High": 159.65,
    #   "week52Low": 93.63,
    #   "ytdChange": 0.3665,
    #   "peRatio": 17.18,
    # }
    #
    # Symbols:
    # https://cloud.iexapis.com/stable/ref-data/region/US/symbols?token=#{iex_key}
    # [
    #   {
    #     "symbol":"A",
    #     "exchange":"NYS",
    #     "name":"Agilent Technologies Inc.",
    #     "date":"2019-08-14",
    #     "type":"cs",
    #     "iexId":"IEX_46574843354B2D52",
    #     "region":"US",
    #     "currency":"USD",
    #     "isEnabled":true
    #   },
    #   .
    #   .
    #   .
    # ]
  end
end
