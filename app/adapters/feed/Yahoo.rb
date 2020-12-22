module Feed
  # This is the Investors Exchange API handler.
  ################################################
  # See the bottom of this file for sample data. #
  ################################################
  class Yahoo
    # Makes data request for an array of symbols.
    # Returns array of results.
    def self.DJIA()
      begin
        Rails.logger.debug "YAHOO PRICE FETCH BEGIN for: DJI."
        resp = Faraday.get("https://finance.yahoo.com/quote/%5EDJI?p=%5EDJI")
        Rails.logger.debug "YAHOO PRICE FETCH END   for: DJI."
      rescue Faraday::ClientError => e
        Rails.logger.error "YAHOO PRICE FETCH ERROR: Faraday client error: #{e}."
        Feed.error_trade(symbol, 'The feed is down.')
      rescue JSON::ParserError => e
        Rails.logger.error "YAHOO PRICE FETCH ERROR: JSON parse error: #{e}."
        Feed.error_trade(symbol, 'The feed is down.')
      rescue URI::InvalidURIError => e
        Rails.logger.error "YAHOO PRICE FETCH ERROR: Invalid URI: #{e}."
        Feed.error_trade(symbol, 'The feed is down.')
      else
        process_price_response(resp.body)
      end
    end

    ### private ###

    # Extract trade data or an error from the response.
    private_class_method def self.process_price_response(response)
      djia = Nokogiri::HTML.parse(response).css('div[data-reactid=30]')
      djia_response = {
        'price'  => djia.css('span[data-reactid=33]').text,
        'change' => djia.css('span[data-reactid=34]').text,
        'status' => djia.css('#quote-market-notice > span').text
      }
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
