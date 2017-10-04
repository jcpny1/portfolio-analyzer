class DailyTradesController < ApplicationController
  # Retrieve the latest closing price for the supplied symbols.
  def last_close
    symbols = params['symbols'].split(',')
    last_close_prices = symbols.map{ |symbol|
      { symbol => StockSymbol.find_by(name: symbol).daily_trades.order(trade_date: :desc).first.close_price }
    }
    render( status: 200, json: last_close_prices )
  end
end
