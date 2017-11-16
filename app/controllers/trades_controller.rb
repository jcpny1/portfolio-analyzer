# This controller handles requests for Trade data.
class TradesController < ApplicationController
  include AlphaVantage, InvestorsExchange  # include Feed handlers here.
  # Feeds that don't have a trade_date should use #missing_trade_date below for the trade_date.

  BATCH_FETCH_SIZE = 50   # Limit on IEX feed is 100 symbols per request. Let's stay well under that for now.

  # Retrieve the latest index values for the symbols specified in params.
  def last_index
    logger.info 'LAST INDEX FETCH BEGIN.'
    trades = load_live_indexes(params[:symbols].split(','))
    logger.info 'LAST INDEX FETCH END.'
    render json: trades, each_serializer: IndexSerializer
  end

  # Retrieve the latest prices for the symbols used by the supplied user_id.
  # Retrieve prices from database. If 'livePrices' is specified, overwrite
  # database values with feed values. The database is acting like a ticker
  # feed cache (that is only updated on user request).
  def last_price
    logger.info 'LAST PRICE FETCH BEGIN.'
    all_trades = []
    symbols = Instrument.select(:id, :symbol).joins(positions: :portfolio).where(portfolios: { user_id: params['userId'] }).distinct.find_in_batches(batch_size: BATCH_FETCH_SIZE) do |symbol_group|
      symbols = symbol_group.map(&:symbol)         # Create symbols array.
      trades = load_trades_from_database(symbols)  # Get last trades from database.
      if params.key?('livePrices')
        live_trades = load_live_prices(symbols)    # Update trades with live feed data.
        save_trades(live_trades, trades)           # Save updates to database.
      end
      all_trades.concat(trades)
    end
    logger.info 'LAST PRICE FETCH END.'
    render json: all_trades, each_serializer: TradeSerializer
  end

  # Store last price data for every symbol in the database.
  def last_price_bulk_load
    logger.info 'LAST PRICE BULK LOAD BEGIN.'
    price_all = true    # Price all symbols? or just those without a price now. (For future use as a param.)
    where_clause = price_all ? '' : 'id not in (select distinct stock_symbol_id from trades)'
    Instrument.select(:id, :symbol).where(where_clause).find_in_batches(batch_size: BATCH_FETCH_SIZE) do |symbol_group|
      symbols = symbol_group.map(&:symbol)          # Create symbols array.
      trades = load_trades_from_database(symbols)   # Fetch database trades.
      live_trades = load_live_prices(symbols)       # Fetch live feed trades.
      sleep 2                                       # Do not slam our feed vendor and get throttled or blocked.
      save_trades(live_trades, trades)              # Update the database.
    end
    logger.info 'LAST PRICE BULK LOAD END.'
    head :ok
  end

  private

  # Create a trade that signifies an error has occurred.
  def error_trade(symbol, error_msg)
    Trade.new(instrument: Instrument.new(symbol: symbol), error: "#{symbol}: #{error_msg}")
  end

  # Create error trades for all symbols.
  def fetch_failure(symbols, trades, error_msg)
    symbols.each_with_index do |symbol, i|
      trades[i] = error_trade(symbol, error_msg)
    end
  end

  # Call feed handler for the latest indexes.
  def load_live_indexes(symbols)
    AV_latest_trades(symbols)
  end

  # Call feed handler for the latest prices.
  def load_live_prices(symbols)
    IEX_latest_trades(symbols)
  end

  # Fetch database trades
  def load_trades_from_database(symbols)
    trades = Array.new(symbols.length)
    symbols.each_with_index do |symbol, i|
      instrument = Instrument.find_by(symbol: symbol)
      if !instrument.nil?
        trades[i] = Trade.where('instrument_id = ?', instrument.id).first
        trades[i] = Trade.new(instrument: instrument) if trades[i].nil?
      else
        trades[i] = error_trade(symbol, 'Invalid symbol.')
      end
    end
    trades
  end

  # Feeds that don't have a trade_date should use this for the trade_date.
  def missing_trade_date
    Time.at(0).to_datetime
  end

  # Save live_trades to the database and save in trades array.
  def save_trades(live_trades, trades)
    Trade.transaction do
      live_trades.each do |live_trade|
        trade = trades.find { |trade| trade.instrument.symbol == live_trade.instrument.symbol }
        trade = Trade.new(instrument: live_trade.instrument) if trade.nil?
        if !live_trade.trade_price.nil?
          begin
            if trade.trade_price.nil? || (live_trade.trade_price != trade.trade_price) || (live_trade.trade_date > trade.trade_date)
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
      end
    end
  end
end
