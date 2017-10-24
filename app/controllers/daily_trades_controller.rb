class DailyTradesController < ApplicationController

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

  # Retrieve the latest closing price for the supplied symbols.
  def last_prices

    symbols = params['symbols'].split(',').uniq
    daily_trades = Array.new(symbols.length)

if params.key?('livePrices')
    api_key = ENV['ALPHA_VANTAGE_API_KEY']
    prices = {}

    begin
      conn = Faraday.new(:url => 'https://www.alphavantage.co/query')

      symbols.each.with_index { |symbol, i|

puts "START price fetch for: " + symbol

        resp = conn.get do |req|
          req.params['function'] = 'TIME_SERIES_INTRADAY'
          req.params['interval'] = '1min'
          req.params['symbol']   = symbol
          req.params['apikey']   = api_key
        end

puts "FETCH complete for: " + symbol

        begin
          response = JSON.parse(resp.body)


        prices[symbol] = {}

        if response.key?('Error Message')
          prices[symbol]['header'] = {'0. Error' => response['Error Message']}
        else
puts("prices: " + prices.inspect)
          prices[symbol]['header'] = response['Meta Data']
          prices[symbol]['tick']   = response['Time Series (1min)'].first
        end
        daily_trade = DailyTrade.new
        daily_trade.stock_symbol = StockSymbol.find_by(name: symbol)
        daily_trade.close_price  = prices[symbol]['tick'].second['4. close'].to_f
        daily_trades[i] = daily_trade

      rescue SyntaxError => e
        puts "JSON parse error: #{e}"
      end
puts "END   price fetch for: " + symbol
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


# end


# create_table "daily_trades", force: :cascade do |t|
#   t.integer "stock_symbol_id", null: false
#   t.integer "trade_date", null: false
#   t.decimal "open_price", null: false
#   t.decimal "close_price", null: false
#   t.decimal "high_price", null: false
#   t.decimal "low_price", null: false
#   t.decimal "trade_volume", null: false
#   t.datetime "created_at", null: false
#   t.datetime "updated_at", null: false
#   t.index ["stock_symbol_id", "trade_date"], name: "index_daily_trades_on_stock_symbol_id_and_trade_date", unique: true
#   t.index ["stock_symbol_id"], name: "index_daily_trades_on_stock_symbol_id"
# end
