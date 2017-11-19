# This controller handles requests for Trade data.
class TradesController < ApplicationController

  # NOTE: Feeds that don't have a trade_date should use `Time.at(0).to_datetime` for the trade_date.

  # Retrieve the latest index values for the symbols specified in params.
  def last_index
    logger.info 'LAST INDEX FETCH BEGIN.'
    trades = load_live_indexes(params[:symbols].split(','))
    logger.info 'LAST INDEX FETCH END.'
    render json: trades, each_serializer: IndexSerializer
  end

  # Retrieve the latest prices for the symbols used by the supplied user_id.
  # Specify param livePrices for database prices supplemented from data feed. OTherwise, only return database prices.
  def last_price
    joins_clause = "INNER JOIN positions ON positions.instrument_id = instruments.id INNER JOIN portfolios ON portfolios.id = positions.portfolio_id"
    where_clause = "portfolios.user_id = #{params['userId']}"
    trades = load_prices(where_clause, joins_clause, params.key?('livePrices'), true)
    render json: trades, each_serializer: TradeSerializer
  end

  # Store last price data for every instrument in the database.
  # Intended for admin user only.
  def last_price_bulk_load
    load_prices('', '', true, false)
    head :accepted
  end

private

# NOTE: Some feeds have a per-request symbol limit. The limit on IEX is 100. Let's stay well under that for now.
BATCH_FETCH_SIZE = 50

  # Call feed handler for the latest indexes.
  def load_live_indexes(symbols)
    av_handler = Adapter::AV.new
    av_handler.latest_trades(symbols)
  end

  # Retrieve prices from database. If 'livePrices' is specified, overwrite database values with feed values.
  # The database is acting like a ticker feed cache (that is only updated on user request).
  def load_prices(where_clause, joins_clause, live_prices, return_results)
    logger.info 'LOAD PRICES BEGIN.'
    fetched_ctr = 0
    requested_ctr = 0
    saved_ctr = 0
    all_trades = []
    symbols = Instrument.select(:id, :symbol).joins(joins_clause).where(where_clause).distinct.find_in_batches(batch_size: BATCH_FETCH_SIZE) do |instruments|
      sleep 1 if requested_ctr.nonzero?               # Do not slam our feed vendor and get throttled or blocked.
      symbols = instruments.map(&:symbol)             # Create symbols array.
      requested_ctr += symbols.length                 # Update requested counter.
      trades = load_prices_from_database(symbols)     # Get last trades from database.
      fetched_ctr += trades.length                    # Update fetched counter.
      if live_prices
        live_trades = load_prices_from_feed(symbols)  # Update trades with live feed data.
        saved_ctr = save_trades(live_trades, trades)  # Save updates to database.
      end
      all_trades.concat(trades) if return_results
    end
    logger.info "LOAD PRICES END (requested: #{requested_ctr}, fetched: #{fetched_ctr}, saved: #{saved_ctr}."
    all_trades
  end

  # Fetch database trades
  def load_prices_from_database(symbols)
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

  # Call feed handler for the latest prices.
  def load_prices_from_feed(symbols)
    iex_handler = Adapter::IEX.new
    iex_handler.latest_trades(symbols)
  end

  # ActiveRecord::StatementInvalid (SQLite3::BusyException: database is locked: commit transaction):
  # 08:25:31 api.1  | ActiveRecord::StatementInvalid (SQLite3::BusyException: database is locked: SELECT  "instruments"."id", "instruments"."symbol" FROM "instruments" WHERE ("instruments"."id" > 600) ORDER BY "instruments"."id" ASC LIMIT ?):
  # 08:25:31 api.1  |
  # 08:25:31 api.1  |
  # 08:25:31 api.1  | app/controllers/trades_controller.rb:98:in `save_trades'
  # (Line 98 was 'Trade.transaction do')
  # sqlite timeout was increased from 5000ms to 10000ms in config/database.yml to try and avoid this.

  # Save live_trades to the database and save in trades array.
  # Returns number of trades actually saved.
  def save_trades(live_trades, trades)
    saved_trades_ctr = 0
    Trade.transaction do
      live_trades.each do |live_trade|
        trade = trades.find { |trade| trade.instrument.symbol == live_trade.instrument.symbol }
        # Leave #new in loop. Only hit on error condition that will likely never occur.
        # It's the case where the feed returned an instrument that we didn't request.
        # For a feed that drives what instruments we get back, you would not want to have a #new in a high frequency loop like this.
        trade = Trade.new(instrument: live_trade.instrument) if trade.nil?
        if !live_trade.trade_price.nil?
          begin
            if trade.changed?(live_trade)
              trade.trade_date   = live_trade.trade_date
              trade.trade_price  = live_trade.trade_price
              trade.price_change = live_trade.price_change
              trade.created_at   = live_trade.created_at
              trade.save!
              saved_trades_ctr += 1
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
    saved_trades_ctr
  end
end
