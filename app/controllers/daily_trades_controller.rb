class DailyTradesController < ApplicationController
   include Yahoo

  # Retrieve the latest prices for the supplied symbols.
  # from live feed if 'livePrices' is specified. Else, from database.

  # NOTE: Keep symbols array and daily_trades array in sync by symbol name.
  #       Use daily_trade.close_price = nil to signal a failed price fetch.

  # TODO Combine symbols and daily_trades arrays into a single object.

  def latest_prices
    symbols = params['symbols'].split(',')
    daily_trades = Array.new(symbols.length)

    if params.key?('livePrices')
      # Fetch live prices
      fillDailyTrades(symbols, daily_trades);
      # Save new prices to database.
      daily_trades.each.with_index { |daily_trade, i|
        begin
          if daily_trade.close_price.nil?
            daily_trades[i] = {error: "Failed to get price for #{symbols[i]}"}
          else
            if !DailyTrade.exists?(stock_symbol_id: daily_trade.stock_symbol.id, trade_date: daily_trade.trade_date)
              daily_trade.save
            end
          end
        rescue ActiveRecord::ActiveRecordError => e
          puts "Error saving daily_trade: #{daily_trade.inspect}, #{e}"
        end
      }
    else
      # Load last saved prices from database.
      symbols.each.with_index { |symbol, i|
        stock_symbol = StockSymbol.find_by(name: symbol)
        daily_trade = DailyTrade.where('stock_symbol_id = ?', stock_symbol.id).order('trade_date DESC').first
        daily_trades[i] = daily_trade.present? ? daily_trade : DailyTrade.new
      }
    end
    render json: daily_trades
  end
end
