module InvestorsExchange extend ActiveSupport::Concern
  #
  # See the bottom of this file for sample data.
  #
  # Make data request(s) for symbols and return results in trades.
  def fillTrades(symbols, trades)
    begin
      symbolList = symbols.join(',')
      puts "IEX PRICE FETCH BEGIN for: #{symbolList}"
      # TODO put conn creation in session variable to cut overhead?
      conn = Faraday.new(url: 'https://api.iextrading.com/1.0/stock/market/batch?types=quote')
      resp = conn.get '', {symbols: symbolList}
      puts "IEX PRICE FETCH END   for: #{symbolList}"
      response = JSON.parse(resp.body)
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      puts "IEX PRICE FETCH ERROR for: #{symbolList}: Faraday client error: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    rescue SyntaxError => e
      puts "IEX PRICE FETCH ERROR for: #{symbolList}: JSON parse error: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    else
      # TODO If symbols.length != response.length, something went wrong.
      #
      # Error example:
      #   <no errors defined yet>
      # Missing data for symbol example:
      #   {"symbol":"XXX","companyName":"","primaryExchange":"","sector":"","calculationPrice":"previousclose","open":null,"openTime":null,"close":null,"closeTime":null,"latestPrice":null,"latestSource":"N/A","latestTime":"N/A","latestUpdate":null,"latestVolume":0,"delayedPrice":null,"delayedPriceTime":null,"previousClose":null,"change":null,"changePercent":null,"iexMarketPercent":null,"avgTotalVolume":0,"marketCap":null,"peRatio":null,"week52High":0,"week52Low":0,"ytdChange":0}
      #
      symbols.each_with_index { |symbol, i|
        symbolTick = response[symbol]['quote']
        if symbolTick.nil?
          trade = error_trade(symbol, 'Price is not available.')
        else
          if symbolTick['companyName'].length == 0
            trade = error_trade(symbol, 'Price is not available.')
          else
            # TODO Need proper timezone info.
            trade = Trade.new do |t|
              t.stock_symbol = StockSymbol.find_by(name: symbol)
              t.trade_date   = Time.at(symbolTick['latestUpdate'].to_f/1000.0).round(4).to_datetime
              t.trade_price  = symbolTick['latestPrice'].to_f.round(4)
              t.price_change = symbolTick['change'].to_f.round(4)
              t.created_at   = DateTime.now
            end
          end
        end
        trades[i] = trade
      }
    end
  end
end

###################
##  SAMPLE DATA  ##
###################
#
# https://api.iextrading.com/1.0/stock/market/batch?types=quote&symbols=aapl,msft
#
# {
#  AAPL: {
#   quote: {
#    symbol	"AAPL"
#    companyName	"Apple Inc."
#    primaryExchange	"Nasdaq Global Select"
#    sector	"Technology"
#    calculationPrice	"close"
#    open	174.1
#    openTime	1509715800281
#    close	172.5
#    closeTime	1509739200293
#    latestPrice	172.5
#    latestSource	"Close"
#    latestTime	"November 3, 2017"
#    latestUpdate	1509739200293
#    latestVolume	58366646
#    .
#    .
#    .
#   }
#  },
#  MSFT: {
#   quote: {
#    symbol	"MSFT"
#    companyName	"Microsoft Corporation"
#    primaryExchange	"Nasdaq Global Select"
#    sector	"Technology"
#    calculationPrice	"sip"
#    open	83.28
#    openTime	1509629400502
#    close	84.05
#    closeTime	1509652800369
#    latestPrice	84.4
#    latestSource	"15 minute delayed price"
#    latestTime	"8:00:02 AM"
#    latestVolume	17626663
#    .
#    .
#    .
#   }
#  }
# }
