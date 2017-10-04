class DailyTradesController < ApplicationController
  # Retrieve the latest closing price for the supplied symbols.
  def last_close
    symbols = params['symbols'].split(',')
    last_close_prices = {}
    symbols.each { |symbol|
      stock_symbol = StockSymbol.find_by(name: symbol)
      last_close_price = stock_symbol.daily_trades.order(trade_date: :desc).first.close_price if stock_symbol.present?
      last_close_prices[symbol] = last_close_price if last_close_price.present?
    }
    render( status: 200, json: last_close_prices )
  end
end
