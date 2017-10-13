class DailyTradesController < ApplicationController
  # Retrieve the latest closing price for the supplied symbols.
  def last_close
    symbols = params['symbols'].split(',').uniq
    last_close_prices = {}
    symbols.each { |symbol|
      stock_symbol = StockSymbol.find_by(name: symbol)
      last_trade_record = stock_symbol.daily_trades.order(trade_date: :desc).first
      last_close_prices[symbol] = last_trade_record.close_price if last_trade_record.present?
    }
    render json: last_close_prices
  end
end
