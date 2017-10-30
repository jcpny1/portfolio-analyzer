module Yahoo extend ActiveSupport::Concern
  require 'csv'
  #
  #  # # # # # # # # # # # #
  #  # #  SAMPLE DATA  # # #
  #  # # # # # # # # # # # #
  #
  # https://download.finance.yahoo.com/d/quotes.csv?s=ORCL+CL&f=sl1d1t1c1
  # \"ORCL\",50.88,\"10/27/2017\",\"4:01pm\",+0.73\n\"CL\",70.40,\"10/27/2017\",\"4:00pm\",-0.81\n
  # After conversion:
  # [
  #  ["ORCL", "50.88", "10/27/2017", "4:01pm", "+0.73"],
  #  ["CL",   "70.40", "10/27/2017", "4:00pm", "-0.81"]
  # ]

  SYMBOL_COL           = 0
  LAST_TRADE_PRICE_COL = 1
  LAST_TRADE_DATE_COL  = 2
  LAST_TRADE_TIME_COL  = 3
  DAY_CHANGE_COL       = 4

  # Make data request(s) for symbols and return results in daily_trades.
  def fillTrades(symbols, daily_trades)
    begin
      symbolList = symbols.join('+')
      puts "PRICE FETCH BEGIN for: #{symbolList}"
      # TODO put conn creation in session variable to cut overhead?
      conn = Faraday.new(url: "https://download.finance.yahoo.com/d/quotes.csv")
      resp = conn.get '', {s: symbolList, f: 'sl1d1t1c1'}
      puts "PRICE FETCH END   for: #{symbolList}"
      response = CSV.parse(resp.body)
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      puts "PRICE FETCH ERROR for: #{symbolList}"
      errorMsg = "Faraday client error: #{e}"
      fetch_failure(symbols, daily_trades, errorMsg)
    rescue CSV::MalformedCSVError => e
      errorMsg = "CSV parse error: #{e}"
      fetch_failure(symbols, daily_trades, errorMsg)
    else
      # TODO If length of symbols != length of response, something went wrong.
      symbols.each.with_index { |symbol, i|
        responseIndex = response.index{ |row| row[SYMBOL_COL] == symbol}
        if !responseIndex.nil?
          responseRow = response[responseIndex]
          if responseRow[LAST_TRADE_PRICE_COL] == 'N/A'
            # Error example: "AXXX","N/A","N/A","N/A","N/A"
            errorMsg = "Price request failure for symbol (#{symbol})."
            daily_trade = error_trade(symbol, errorMsg, true)
          else
            # TODO Replace 'EDT' with proper timezone info.
            daily_trade = Trade.new do |dt|
              dt.stock_symbol = StockSymbol.find_by(name: symbol)
              dt.trade_date   = DateTime.strptime("#{responseRow[LAST_TRADE_DATE_COL]} #{response[responseIndex][LAST_TRADE_TIME_COL]} EDT", '%m/%d/%Y %l:%M%P %Z')
              dt.trade_price  = responseRow[LAST_TRADE_PRICE_COL]
              dt.day_change   = responseRow[DAY_CHANGE_COL]
            end
          end
        else
          errorMsg = "Price request failure for symbol (#{symbol})."
          daily_trade = error_trade(symbol, errorMsg, true)
        end
        daily_trades[i] = daily_trade
      }
    end
  end
end
