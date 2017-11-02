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

  # Make data request(s) for symbols and return results in trades.
  def fillTrades(symbols, trades)
    begin
      symbolList = symbols.join('+')
      puts "YAHOO PRICE FETCH BEGIN for: #{symbolList}"
      # TODO put conn creation in session variable to cut overhead?
      conn = Faraday.new(url: "https://download.finance.yahoo.com/d/quotes.csv")
      resp = conn.get '', {s: symbolList, f: 'sl1d1t1c1'}
      puts "YAHOO PRICE FETCH END   for: #{symbolList}"
      response = CSV.parse(resp.body)
      raise LoadError, 'The feed is down.' if resp.body.include? '999 Unable to process request at this time'
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      puts "YAHOO PRICE FETCH ERROR for: #{symbolList}: Faraday client error: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    rescue CSV::MalformedCSVError => e
      puts "YAHOO PRICE FETCH ERROR for: #{symbolList}: CSV parse error: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    rescue LoadError => e
      puts "YAHOO PRICE FETCH ERROR for: #{symbolList}: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    else
      # TODO If length of symbols != length of response, something went wrong.

      # overall Fetch error example
      # resp.body: "<html><head><title>Yahoo! - 999 Unable to process request at this time -- error 999</title></head><body>Sorry, Unable to process request at this time -- error 999.</body></html>"
      # => [["<html><head><title>Yahoo! - 999 Unable to process request at this time -- error 999</title></head><body>Sorry", " Unable to process request at this time -- error 999.</body></html>"]]

      symbols.each_with_index { |symbol, i|
        responseIndex = response.index{ |row| row[SYMBOL_COL] == symbol}
        if !responseIndex.nil?
          responseRow = response[responseIndex]
          if responseRow[LAST_TRADE_PRICE_COL] == 'N/A'
            # Error example: "AXXX","N/A","N/A","N/A","N/A"
            trade = error_trade(symbol, 'Price is not available.')
          else
            # TODO Replace 'EDT' with proper timezone info.
            trade = Trade.new do |t|
              t.stock_symbol = StockSymbol.find_by(name: symbol)
              t.trade_date   = DateTime.strptime("#{responseRow[LAST_TRADE_DATE_COL]} #{response[responseIndex][LAST_TRADE_TIME_COL]} EDT", '%m/%d/%Y %l:%M%P %Z')
              t.trade_price  = responseRow[LAST_TRADE_PRICE_COL]
              t.price_change = responseRow[DAY_CHANGE_COL]
              t.created_at   = DateTime.now
            end
          end
        else
          trade = error_trade(symbol, 'Price for symbol is not available.')
        end
        trades[i] = trade
      }
    end
  end
end
