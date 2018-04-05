module Feed
  # This is the Alpha Vantage API handler.
  ################################################
  # See the bottom of this file for sample data. #
  ################################################
  class AV
    # Makes data request for an array of symbols.
    # Returns array of results.
    def self.latest_trades(symbols)
      begin
        conn = Faraday.new(url: 'https://www.alphavantage.co/query')
      rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
        Rails.logger.error "AV PRICE FETCH ERROR for: #{symbols.inspect}."
        error_msg = "Faraday client error: #{e}"
        Feed.fetch_trade_request_failure(symbols, error_msg)
      else
        symbols.map do |symbol|
          begin
            Rails.logger.debug "AV PRICE FETCH BEGIN for: #{symbol}."
            resp = conn.get do |req|
              req.params['function'] = 'TIME_SERIES_DAILY'
              req.params['symbol']   = symbol
              req.params['apikey']   = alpha_vantage_key
            end
            Rails.logger.debug "AV PRICE FETCH END   for: #{symbol}."
            response = JSON.parse(resp.body)
          rescue Faraday::ClientError => e
            Rails.logger.error "AV PRICE FETCH ERROR for: #{symbol}: Faraday client error: #{e}."
            Feed.error_trade(symbol, 'The feed is down.')
          rescue JSON::ParserError => e
            Rails.logger.error "AV PRICE FETCH ERROR for: #{symbol}: JSON parse error: #{e}."
            Feed.error_trade(symbol, 'The feed is down.')
          else
            process_price_response(symbol, response)
          end
        end
      end
    end

    # Makes data request(s) for an array of symbols and returns results in an augmented trades array.
    def self.monthly_series(symbols)
      begin
        conn = Faraday.new(url: 'https://www.alphavantage.co/query')
        # conn = Faraday.new(:url => 'https://www.alphavantage.co/query') do |faraday|
        #   faraday.request  :url_encoded             # form-encode POST params
        #   faraday.response :logger                  # log requests to STDOUT
        #   faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
        # end
      rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
        Rails.logger.error "AV SERIES FETCH ERROR for: #{symbols.inspect}."
        error_msg = "Faraday client error: #{e}"
        Feed.fetch_series_request_failure(symbols, error_msg)
      else
        symbols.map do |symbol|
          begin
            Rails.logger.debug "AV SERIES FETCH BEGIN for: #{symbol}."
            resp = conn.get do |req|
              req.params['function'] = 'TIME_SERIES_MONTHLY_ADJUSTED'
              req.params['symbol']   = symbol
              req.params['apikey']   = alpha_vantage_key
            end
            Rails.logger.debug "AV SERIES FETCH END   for: #{symbol}."
            response = JSON.parse(resp.body)
          rescue Faraday::ClientError => e
            Rails.logger.error "AV SERIES FETCH ERROR for: #{symbol}: Faraday client error: #{e}."
            Feed.error_series(symbol, 'The feed is down.')
          rescue JSON::ParserError => e
            Rails.logger.error "AV SERIES FETCH ERROR for: #{symbol}: JSON parse error: #{e}."
            Feed.error_series(symbol, 'The feed is down.')
          else
            process_series_response(symbol, response)
          end
        end
      end
    end

    ### private ###

    # Return the Alpha Vantage API key.
    private_class_method def self.alpha_vantage_key
      @@api_key ||= ENV['RAILS_ENV'] == 'test' ? nil : ENV['ALPHA_VANTAGE_API_KEY']
    end

    # Error examples:
    #   {"Error Message"=>"Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_INTRADAY."}
    #   {"Information"=>"Please consider optimizing your API call frequency."}

    # Extract trade data or an error from the response.
    # NOTE: The symbol in the meta data doesn't always match the symbol requested.
    #       e.g., 'DJIA' => 'Dow Jones Industrial Average Index'
    private_class_method def self.process_price_response(symbol, response)
      if response.key?('Time Series (Daily)')
        ticks = response['Time Series (Daily)']
        current_trade_price = ticks.values[0]['4. close'].to_f.round(4)
        prior_trade_price   = ticks.values[1]['4. close'].to_f.round(4)
        Trade.new do |t|
          t.instrument = Instrument.find_by(symbol: symbol)
          t.instrument = Instrument.new(symbol: symbol) if t.instrument.nil?    # We don't keep index instruments in the database, so make one up here.
          t.trade_date   = Feed.missing_trade_date
          t.trade_price  = current_trade_price
          t.price_change = (current_trade_price - prior_trade_price).round(4)
          t.created_at   = DateTime.now
        end
      else
        Rails.logger.error "AV PRICE FETCH ERROR for: #{symbol}: #{response.first}."
        Feed.error_trade(symbol, 'Price is not available.')
      end
    end

    START_YEAR = 2013

    # Extract series data or an error from the response.
    # NOTE: The symbol in the meta data doesn't always match the symbol requested.
    #       e.g., 'DJIA' => 'Dow Jones Industrial Average Index'
    private_class_method def self.process_series_response(symbol, response)
      if response.key?('Monthly Adjusted Time Series')
        ticks = response['Monthly Adjusted Time Series']
        instrument = Instrument.find_by(symbol: symbol) if instrument.nil?
        instrument = Instrument.new(symbol: symbol) if instrument.nil?    # We don't keep index instruments in the database, so make one up here.
        fetch_time = DateTime.now
        ticks.map do |key, value|
          next if key[0..3].to_i < START_YEAR
          # TODO: Get timezone from Meta Data.
          Series.new do |s|
            s.instrument = instrument
            s.time_interval = 'MA'
            s.series_date = key
            s.open_price = value['1. open'].to_f.round(4)
            s.high_price = value['2. high'].to_f.round(4)
            s.low_price = value['3. low'].to_f.round(4)
            s.close_price = value['4. close'].to_f.round(4)
            s.adjusted_close_price = value['5. adjusted close'].to_f.round(4)
            s.volume = value['6. volume'].to_f.round(4)
            s.dividend_amount = value['7. dividend amount'].to_f.round(4)
            s.created_at = fetch_time
          end
        end
      else
        Rails.logger.error "AV SERIES FETCH ERROR for: #{symbol}: #{response.first}."
        Feed.error_series(symbol, 'Price is not available.')
      end
    end

    ###################
    ##  SAMPLE DATA  ##
    ###################
    #
    # INTRADAY:
    # https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo
    # {
    #   "Meta Data"=>
    #   {
    #     "1. Information"=>"Intraday (1min) prices and volumes",
    #     "2. Symbol"=>"MSFT",
    #     "3. Last Refreshed"=>"2017-10-20 16:00:00",
    #     "4. Interval"=>"1min",
    #     "5. Output Size"=>"Compact",
    #     "6. Time Zone"=>"US/Eastern"
    #   },
    #   "Time Series (1min)"=>
    #   {
    #     "2017-10-20 16:00:00"=>
    #     {
    #       "1. open"=>"78.7000",
    #       "2. high"=>"78.8100",
    #       "3. low"=>"78.6950",
    #       "4. close"=>"78.8100",
    #       "5. volume"=>"2663315"
    #     },
    #     "2017-10-20 15:59:00"=>
    #     {
    #       "1. open"=>"78.7000",
    #       "2. high"=>"78.7200",
    #       "3. low"=>"78.6900",
    #       "4. close"=>"78.7000",
    #       "5. volume"=>"320215"
    #     },
    #     .
    #     .
    #     .
    #   }
    # }
    #
    # DAILY:
    # https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo
    # {
    #   "Meta Data"=>
    #   {
    #    "1. Information	"Daily Prices (open, high, low, close) and Volumes"
    #    "2. Symbol	"MSFT"
    #    "3. Last Refreshed	"2017-11-02 11:46:00"
    #    "4. Output Size	"Compact"
    #    "5. Time Zone	"US/Eastern"
    #   },
    #   "Time Series (Daily)"=>
    #   {
    #    "2017-11-02"=>
    #    {
    #      "1. open	"83.3500"
    #      "2. high	"84.0300"
    #      "3. low	"83.1200"
    #      "4. close	"83.5500"
    #      "5. volume	"8642391"
    #    },
    #    "2017-11-01"=>
    #    {
    #     "1. open	"83.6800"
    #     "2. high	"83.7600"
    #     "3. low	"82.8800"
    #     "4. close	"83.1800"
    #     "5. volume	"22039635"
    #    },
    #     .
    #     .
    #     .
    #   }
    # }
    #
    # MONTHLY ADJUSTED:
    # https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=demo
    # {
    #   "Meta Data":
    #   {
    #    "1. Information": "Monthly Adjusted Prices and Volumes",
    #    "2. Symbol": "MSFT",
    #    "3. Last Refreshed": "2018-03-13 10:41:45",
    #    "4. Time Zone": "US/Eastern"
    #   },
    #   "Monthly Adjusted Time Series": {
    #     "2018-03-13": {
    #       "1. open": "93.9900",
    #       "2. high": "97.2400",
    #       "3. low": "90.8600",
    #       "4. close": "95.3350",
    #       "5. adjusted close": "95.3350",
    #       "6. volume": "213852001",
    #       "7. dividend amount": "0.0000"
    #     },
    #     "2018-02-28": {
    #       "1. open": "94.7900",
    #       "2. high": "96.0700",
    #       "3. low": "83.8300",
    #       "4. close": "93.7700",
    #       "5. adjusted close": "93.7700",
    #       "6. volume": "690287596",
    #       "7. dividend amount": "0.4200"
    #     },
    #      .
    #      .
    #      .
    #   }
    # }
  end
end
