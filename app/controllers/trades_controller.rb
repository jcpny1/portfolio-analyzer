class TradesController < ApplicationController
   include InvestorsExchange  # include Feed handler here.

  # Retrieve the latest prices for the supplied symbols.
  # from live feed if 'livePrices' is specified. Else, from database.
  # To handle case of feed down not trashing client's existing prices,
  # first load database latest prices, then overlay with whatever we
  # can get from live feed.
  # In a production environment, going to the database here would not
  # be necessary. The latest prices (live or otherwise) would be in an
  # in-memory cache.
  #
  # NOTE: Keep symbols array and trades array in sync by symbol name.
  #       Use trade.error to signal a failed price fetch.
  #       For feeds without a last trade datetime, use year 1492 to signal its absence.
  #
  # TODO Combine symbols and trades arrays into a single object.
  def last_price
    symbols = symbolsForUser(params['userId'])
    trades  = Array.new(symbols.length)

    # Load last saved prices from database.
    symbols.each_with_index { |symbol, i|
      stock_symbol = StockSymbol.find_by(name: symbol)
      if !stock_symbol.nil?
        trade = Trade.where('stock_symbol_id = ?', stock_symbol.id).order('trade_date DESC, created_at DESC').first
        trades[i] = (!trade.nil?) ? trade : error_trade(symbol, 'No trades available.')
      else
        trades[i] = error_trade(symbol, 'Invalid symbol.')
      end
    }

    if params.key?('livePrices')
      live_trades = load_live_prices(symbols)
      save_trades(live_trades, trades)
    end
    render json: trades, each_serializer: TradeSerializer
  end

  private

  # Create a trade that signifies an error has occurred.
  def error_trade(symbol, errorMsg)
    Trade.new(stock_symbol: StockSymbol.new(name: symbol), error: "#{symbol}: #{errorMsg}")
  end

  # Create error trades for all symbols.
  def fetch_failure(symbols, trades, errorMsg)
    symbols.each_with_index { |symbol, i|
      trades[i] = error_trade(symbol, errorMsg)
    }
  end

  # Call feed handler for the latest prices.
  def load_live_prices(symbols)
    live_trades = Array.new(symbols.length)
    fill_trades(symbols, live_trades);
    return live_trades
  end

  # Feeds that don't have a trade_date should use this for the trade_date.
  def missing_trade_date()
    return Time.at(0).to_datetime
  end

  # Save live_trades to the database and save in trades array.
  def save_trades(live_trades, trades)
    Trade.transaction do
      live_trades.each_with_index { |live_trade, i|
        if !live_trade.trade_price.nil?
          begin
            if((live_trade.trade_price != trades[i].trade_price) || (live_trade.trade_date > trades[i].trade_date))
              live_trade.save!
              trade_index = trades.index { |trade| trade.stock_symbol.name == live_trade.stock_symbol.name }
              trades[trade_index] = live_trade if !trade_index.nil?
            end
          rescue ActiveRecord::ActiveRecordError => e
            logger.error "Error saving trade: #{trade.inspect}, #{e}"
            trades[i].error = live_trade.error
          end
        else
          trades[i].error = live_trade.error
        end
      }
    end
  end

  # Return a list of symbols used by this user_id.
  def symbolsForUser(user_id)
    symbols = []
    portfolios = Portfolio.where('user_id = ?', params['userId'])
    portfolios.each { |portfolio|
      portfolio.positions.each { |position|
        symbols.push(position.stock_symbol.name)
      }
    }
    symbols.uniq
  end
end
