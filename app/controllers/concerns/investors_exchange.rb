module InvestorsExchange extend ActiveSupport::Concern
  #
  # See the bottom of this file for sample data.
  #
  # Make data request(s) for symbols and return results in trades.
  def fillTrades(symbols, trades)
    begin
      symbolList = symbols.join(',')
      logger.debug "IEX PRICE FETCH BEGIN for: #{symbolList}"
      # TODO put conn creation in session variable to cut overhead?
      conn = Faraday.new(url: 'https://api.iextrading.com/1.0/stock/market/batch?types=quote&filter=companyName,latestPrice,change,latestUpdate')
      resp = conn.get '', {symbols: symbolList}
      fetchTime = DateTime.now
      logger.debug "IEX PRICE FETCH END   for: #{symbolList}"
      response = JSON.parse(resp.body)
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      logger.error "IEX PRICE FETCH ERROR for: #{symbolList}: Faraday client error: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    rescue JSON::ParserError => e  # JSON.parse error
      logger.error "IEX PRICE FETCH ERROR for: #{symbolList}: JSON parse error: #{e}"
      fetch_failure(symbols, trades, 'The feed is down.')
    else
      # TODO If symbols.length != response.length, something went wrong.
      #
      # Error example:
      #   <no errors defined yet>
      #
      symbols.each_with_index { |symbol, i|
        if (symbolTick = response[symbol]).nil? || (symbolQuote = symbolTick['quote']).nil?
          trade = error_trade(symbol, 'Price is not available.')
        else
          # TODO Need proper timezone info.
          trade = Trade.new do |t|
            t.stock_symbol = StockSymbol.find_by(name: symbol)
            t.trade_date   = Time.at(symbolQuote['latestUpdate'].to_f/1000.0).round(4).to_datetime
            t.trade_price  = symbolQuote['latestPrice'].to_f.round(4)
            t.price_change = symbolQuote['change'].to_f.round(4)
            t.created_at   = fetchTime
          end
        end
        trades[i] = trade
      }
    end
  end

  # Return the feed's list of valid symbols.
  def getSymbology()
    begin
      response = {}
      logger.debug 'IEX SYMBOLOGY FETCH BEGIN'
      resp = Faraday.get('https://api.iextrading.com/1.0/ref-data/symbols')
      logger.debug 'IEX SYMBOLOGY FETCH END'
      response = JSON.parse(resp.body)
    rescue Faraday::ClientError => e  # Can't connect.
      logger.error "IEX SYMBOLOGY FETCH ERROR: Faraday client error: #{e}"
    rescue JSON::ParserError => e  # JSON.parse error
      logger.error "IEX SYMBOLOGY FETCH ERROR: JSON parse error: #{e}"
    end
    return response
  end
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
