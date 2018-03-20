module Feed
  # This is the Investors Exchange API handler.
  class IEX
    #
    # See the bottom of this file for sample data.
    #
    # Makes data request(s) for an array of symbols and returns results in trades.
    def self.latest_trades(symbols)
      fetch_time = DateTime.now
      symbol_list = symbols.join(',')
      trades = Array.new(symbols.length)
      uri = Addressable::URI.parse('https://api.iextrading.com/1.0/stock/market/batch')
      uri.query_values = { types: 'quote', filter: 'companyName,latestPrice,change,latestUpdate', symbols: symbol_list }
      begin
        Rails.logger.debug "IEX PRICE FETCH BEGIN for: #{symbol_list}."
        resp = Faraday.get(uri)
        Rails.logger.debug "IEX PRICE FETCH END   for: #{symbol_list}."
        response = JSON.parse(resp.body)
      rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
        Rails.logger.error "IEX PRICE FETCH ERROR for: #{symbol_list}: Faraday client error: #{e}."
        Feed.fetch_trade_failure(symbols, trades, 'The feed is down.')
      rescue JSON::ParserError => e  # JSON.parse error
        Rails.logger.error "IEX PRICE FETCH ERROR for: #{symbol_list}: JSON parse error: #{e}."
        Feed.fetch_trade_failure(symbols, trades, 'The feed is down.')
      else
        #
        # Error example:
        #   <no errors defined yet>
        #
        symbols.each_with_index do |symbol, i|
          trades[i] = process_price_response(symbol, response)
          trades[i].created_at = fetch_time
        end
      end
      trades
    end

    # Return the feed's list of valid symbols.
    # Response format: [{symbol; 'ABC', name: 'Acme Banana'}]
    def self.symbology
      begin
        response = {}
        Rails.logger.debug 'IEX SYMBOLOGY FETCH BEGIN.'
        resp = Faraday.get('https://api.iextrading.com/1.0/ref-data/symbols')
        Rails.logger.debug 'IEX SYMBOLOGY FETCH END.'
        response = JSON.parse(resp.body)
      rescue Faraday::ClientError => e  # Can't connect.
        Rails.logger.error "IEX SYMBOLOGY FETCH ERROR: Faraday client error: #{e}."
      rescue JSON::ParserError => e  # JSON.parse error
        Rails.logger.error "IEX SYMBOLOGY FETCH ERROR: JSON parse error: #{e}."
      end
      response
    end

    ### private ###

    # Extract trade data or an error from the response.
    private_class_method def self.process_price_response(symbol, response)
      if (symbol_tick = response[symbol]).nil? || (symbol_quote = symbol_tick['quote']).nil?
        trade = Feed.error_trade(symbol, 'Price is not available.')
      else
        # TODO: Need proper timezone info.
        # TODO: Consider not using a Trade here. It looks like it's causing an unecessary Instrument lookup. We only need the symbol.
        #       On the other hand, then the caller would need to create or update a Trade object from this object.
        trade = Trade.new do |t|
          t.instrument   = Instrument.find_by(symbol: symbol)
          t.trade_date   = Time.at(symbol_quote['latestUpdate'].to_f/1000.0).round(4).to_datetime
          t.trade_price  = symbol_quote['latestPrice'].to_f.round(4)
          t.price_change = symbol_quote['change'].to_f.round(4)
        end
      end
      trade
    end

    ###################
    ##  SAMPLE DATA  ##
    ###################
    #
    # Quotes:
    # https://api.iextrading.com/1.0/stock/market/batch?types=quote&filter=companyName,latestPrice,change,latestUpdate&symbols=aapl,msft
    # {
    #  AAPL: {
    #   quote: {
    #    companyName	"Apple Inc."
    #    latestPrice	172.5
    #    change	4.39
    #    latestUpdate	1509739200293
    #   }
    #  },
    #  MSFT: {
    #   quote: {
    #    companyName	"Microsoft Corporation"
    #    latestPrice	84.4
    #    change	1.09
    #    latestUpdate	1509739220275
    #   }
    #  }
    # }
    #
    # Symbols:
    # https://api.iextrading.com/1.0/ref-data/symbols'
    # [
    #  {
    #   "symbol":"A",
    #   "name":"Agilent Technologies Inc.",
    #   "date":"2017-11-03",
    #   "isEnabled":true,
    #   "type":"cs"
    #  },
    #  {
    #   "symbol":"AA",
    #   "name":"Alcoa Corporation",
    #   "date":"2017-11-03",
    #   "isEnabled":true,
    #   "type":"cs"
    #   },
    #   .
    #   .
    #   .
    # ]
  end
end
