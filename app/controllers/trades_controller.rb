# This controller handles requests for Trade data.
class TradesController < ApplicationController
  # Retrieve the latest index values for the symbols specified in params.
  def last_index
    logger.info 'LAST INDEX LOAD BEGIN.'
    trades = Feed::AV.latest_trades(params[:symbols].split(','))
    logger.info 'LAST INDEX LOAD END.'
    render json: trades, each_serializer: IndexSerializer
  end

  # Retrieve the latest prices for the symbols used by the supplied user_id.
  # Specify param 'livePrices' to supplement database prices with feed prices. Otherwise, only return database prices.
  def last_price
    logger.info 'LAST PRICE LOAD BEGIN.'
    instruments = Instrument.select(:id, :symbol).joins(positions: :portfolio).where(portfolios: { user_id: params['userId'] }).distinct  # Get instrument list.
    trades = load_prices_from_database(instruments)  # Get database prices.
    if params.key?('livePrices')
      live_trades = Feed::load_prices(instruments)   # Get feed prices.
      saved_ctr = save_trades(live_trades, trades)   # Update database prices with feed prices.
    end
    logger.info "LAST PRICE LOAD END (new prices saved: #{saved_ctr})."
    render json: trades, each_serializer: TradeSerializer
  end

  # Store last price data for every instrument in the database.
  # Intended for admin user only.
  def last_price_bulk_load
    logger.info 'LAST PRICE BULK LOAD BEGIN.'
    instruments = Instrument.select(:id, :symbol)  # Get instrument list.
    live_trades = Feed::load_prices(instruments)   # Get feed prices.
    saved_ctr = save_trades(live_trades, trades)   # Update database prices with feed prices.
    logger.info "LAST PRICE BULK LOAD END (saved: #{saved_ctr})."
    # logger.info 'PRICE BULK LOAD REQUESTED.'
    # FeedWorker.perform_async('price_bulk_load')
    # head :accepted
    head :accepted
  end

private

  # Fetch database trades
  def load_prices_from_database(instruments)
    trades = Array.new(instruments.length)
    instruments.each_with_index do |instrument, i|
      trades[i] = Trade.where('instrument_id = ?', instrument.id).first
      trades[i] = Trade.new(instrument: instrument) if trades[i].nil?
    end
    trades
  end

  # During save_trades, encountered:
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
