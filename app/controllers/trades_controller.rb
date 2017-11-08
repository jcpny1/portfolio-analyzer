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
  def last_price
    symbols = symbolsForUser(params['userId'])  # Create symbol list.
    trades = load_trades_from_database(symbols) # Get last trades from database.

    # Update trades with live feed data. Save to database if updated.
    if params.key?('livePrices')
      live_trades = load_live_prices(symbols)
      save_trades(live_trades, trades)
    end

    render json: trades, each_serializer: TradeSerializer
  end

  # Store latest price data for each symbol in the database.
  def load_latest_prices_bulk
    price_all = true    # Price all symbols? or just those without a price now. (For future use as a param.)
    whereClause = (price_all) ? '' : 'id not in (select distinct stock_symbol_id from trades)'
    StockSymbol.select(:id,:name).where(whereClause).find_in_batches(batch_size:50) do |symbolGroup|
      symbols = symbolGroup.map { |symbol| symbol.name }  # Create symbols array.
      trades = load_trades_from_database(symbols)         # Fetch database trades.
      live_trades = load_live_prices(symbols)             # Fetch live feed trades.
      sleep 2  # Do not slam our feed vendor and get throttled or blocked.
      save_trades(live_trades, trades)                    # Update the database.
    end
    render json: {}, status: :ok
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
    latest_trades(symbols);
  end

  # Fetch database trades
  def load_trades_from_database(symbols)
    trades  = Array.new(symbols.length)
    symbols.each_with_index { |symbol, i|
      stock_symbol = StockSymbol.find_by(name: symbol)
      if !stock_symbol.nil?
        trades[i] = Trade.where('stock_symbol_id = ?', stock_symbol.id).first
        trades[i] = Trade.new(stock_symbol: stock_symbol) if trades[i].nil?
      else
        trades[i] = error_trade(symbol, 'Invalid symbol.')
      end
    }
    trades
  end

  # Feeds that don't have a trade_date should use this for the trade_date.
  def missing_trade_date()
    return Time.at(0).to_datetime
  end

  # Save live_trades to the database and save in trades array.
  def save_trades(live_trades, trades)
    Trade.transaction do
      live_trades.each { |live_trade|
        trade = trades.find { |trade| trade.stock_symbol.name == live_trade.stock_symbol.name }
        trade = Trade.new(stock_symbol: live_trade.stock_symbol) if trade.nil?
        if !live_trade.trade_price.nil?
          begin
            if (trade.trade_price.nil?) || (live_trade.trade_price != trade.trade_price) || (live_trade.trade_date > trade.trade_date)
              trade.trade_date   = live_trade.trade_date
              trade.trade_price  = live_trade.trade_price
              trade.price_change = live_trade.price_change
              trade.created_at   = live_trade.created_at
              trade.save!
            end
          rescue ActiveRecord::ActiveRecordError => e
            logger.error "Error saving trade: #{trade.inspect}, #{e}"
            trade.error = live_trade.error
          end
        else
          trade.error = live_trade.error
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
