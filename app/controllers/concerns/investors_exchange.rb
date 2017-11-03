module InvestorsExchange extend ActiveSupport::Concern
  #
  #  # # # # # # # # # # # #
  #  # #  SAMPLE DATA  # # #
  #  # # # # # # # # # # # #
  #
  # https://api.iextrading.com/1.0/stock/msft/quote
  # {
  #  symbol	"MSFT"
  #  companyName	"Microsoft Corporation"
  #  primaryExchange	"Nasdaq Global Select"
  #  sector	"Technology"
  #  calculationPrice	"sip"
  #  open	83.28
  #  openTime	1509629400502
  #  close	84.05
  #  closeTime	1509652800369
  #  latestPrice	84.4
  #  latestSource	"15 minute delayed price"
  #  latestTime	"8:00:02 AM"
  #  .
  #  .
  #  .
  # }

  # Make data request(s) for symbols and return results in trades.
  def fillTrades(symbols, trades)
    begin
      # TODO put conn creation in session variable to cut overhead?
      conn = Faraday.new(url: 'https://api.iextrading.com/1.0/stock')
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      puts "IEX PRICE FETCH ERROR for: #{symbols.inspect}"
      errorMsg = "Faraday client error: #{e}"
      fetch_failure(symbols, trades, errorMsg)
    end
    symbols.each_with_index { |symbol, i|
      begin
        puts "IEX PRICE FETCH BEGIN for: #{symbol}"
        resp = conn.get "#{symbol}/quote"
        puts "IEX PRICE FETCH END   for: #{symbol}"
        response = JSON.parse(resp.body)
      rescue Faraday::ClientError => e
        puts "IEX PRICE FETCH ERROR for: #{symbolList}: Faraday client error: #{e}"
        fetch_failure(symbols, trades, 'The feed is down.')
      rescue SyntaxError => e
        puts "IEX PRICE FETCH ERROR for: #{symbolList}: JSON parse error: #{e}"
        fetch_failure(symbols, trades, 'The feed is down.')
      else
        # Error example:
        #
        # if response.key?('Error Message') || response.length == 0
        #   puts "IEX PRICE FETCH ERROR for: #{symbol}: #{response['Error Message']}"
        #   trade = error_trade(symbol, 'Price is not available.')
        # Missing data for symbol example:
        #   {"symbol":"XXX","companyName":"","primaryExchange":"","sector":"","calculationPrice":"previousclose","open":null,"openTime":null,"close":null,"closeTime":null,"latestPrice":null,"latestSource":"N/A","latestTime":"N/A","latestUpdate":null,"latestVolume":0,"delayedPrice":null,"delayedPriceTime":null,"previousClose":null,"change":null,"changePercent":null,"iexMarketPercent":null,"avgTotalVolume":0,"marketCap":null,"peRatio":null,"week52High":0,"week52Low":0,"ytdChange":0}
        if response['companyName'].length == 0
          trade = error_trade(symbol, 'Price is not available.')
        else
          trade = Trade.new do |t|
            t.stock_symbol = StockSymbol.find_by(name: symbol)
            t.trade_date   = Time.at(response['latestUpdate'].to_f/1000.0).to_datetime
            t.trade_price  = response['latestPrice']
            t.price_change = response['change']
            t.created_at   = DateTime.now
          end
        end
      ensure
        trades[i] = trade
      end
    }
  end
end
