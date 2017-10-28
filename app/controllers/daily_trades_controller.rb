class DailyTradesController < ApplicationController
  #
  # # #  SAMPLE RESPONSE DATA  # # #
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

  # Retrieve the latest prices for the supplied symbols.
  # from live feed if 'livePrices' is specified. Else, from database.
  def latest_prices
    symbols = params['symbols'].split(',').uniq
    daily_trades = Array.new(symbols.length)

    if params.key?('livePrices')
      api_key = ENV['ALPHA_VANTAGE_API_KEY']
      prices = {}
      begin
# TODO put conn in session?
        conn = Faraday.new(:url => 'https://www.alphavantage.co/query')

        symbols.each.with_index { |symbol, i|
          puts "PRICE FETCH BEGIN for: " + symbol
          resp = conn.get do |req|
            req.params['function'] = 'TIME_SERIES_INTRADAY'
            req.params['interval'] = '1min'
            req.params['symbol']   = symbol
            req.params['apikey']   = api_key
          end
          puts "PRICE FETCH END   for: " + symbol

          begin
            response = JSON.parse(resp.body)
            daily_trade = DailyTrade.new
            daily_trade.stock_symbol = StockSymbol.find_by(name: symbol)

            # Error example:
            # {"Error Message"=>"Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_INTRADAY."}
            #
            if response.key?('Error Message') || response.length == 0
              header = {'0. Error' => response['Error Message']}
              daily_trades[i] = header
            else
              header = response['Meta Data']
              tick   = response['Time Series (1min)'].first
              time   = tick.first
              prices = tick.second
              # TODO get timezone from Meta Data
              daily_trade.trade_date   = time + " EDT"
              daily_trade.open_price   = prices['1. open'].to_f
              daily_trade.high_price   = prices['2. high'].to_f
              daily_trade.low_price    = prices['3. low'].to_f
              daily_trade.close_price  = prices['4. close'].to_f
              daily_trade.trade_volume = prices['5. volume'].to_f

              # This is needed because symbol/trade datetime is unique and our feed only updates about once a minute.
              # If we make multiple pricing requests for a symbol in a short amount of time, we'll get duplicates.
              begin
                if !DailyTrade.exists?(stock_symbol_id: daily_trade.stock_symbol.id, trade_date: daily_trade.trade_date)
                  daily_trade.save
                end
              rescue ActiveRecord::ActiveRecordError => e
                daily_trades[i] = "DailyTrade save error: #{e}"
                puts daily_trades[i]
              end

              daily_trades[i] = daily_trade
            end

          rescue SyntaxError => e
            puts "JSON parse error: #{e}"
          end
        }

      rescue Faraday::ClientError => e
        puts "Faraday client error: #{e}"
      end
    else
      symbols.each.with_index { |symbol, i|
        stock_symbol = StockSymbol.find_by(name: symbol)
        daily_trade = DailyTrade.where('stock_symbol_id = ?', stock_symbol.id).order('trade_date DESC').first
        daily_trades[i] = daily_trade.present? ? daily_trade : DailyTrade.new
      }
    end
    render json: daily_trades
  end
end
