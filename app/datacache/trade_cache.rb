# This class is responsible for interfacing the outside world with the Trade data store.
class TradeCache
  # Stay within feed vendor limits. Don't risk getting blacklisted or throttled.
  # Also, don't lock up the Trade database table for too long.
  BATCH_SIZE  = 50      # Number of records to process in one transaction.
  BATCH_DELAY =  1.000  # Delay time between transactions (in seconds).

  # Retrieve the latest prices for the given instrument list.
  # Specify getLivePrices to retrieve feed data. Otherwise, just get prices from database.
  def self.last_prices(instruments, getLivePrices)
    trades = []
    instruments.each_slice(BATCH_SIZE) do |instrument_batch|
      trade_batch = load_prices_from_database(instrument_batch)    # Get database prices as a baseline.
      if getLivePrices
        sleep BATCH_DELAY if trades.length.nonzero? # Throttle request rate.
        Feed::load_prices(instrument_batch) do |live_trades|  # Get feed prices.
          save_trades(live_trades, trade_batch)  # Update database prices with feed prices.
        end
      end
      trades.concat(trade_batch)
    end
    trades
  end

  ### private ###

  # Fetch database trades
  private_class_method def self.load_prices_from_database(instruments)
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
  # sqlite timeout was increased from 5000ms to 10000ms in config/database.yml in an attempt to avoid this.

  # Updates trades with live_trades data and saves to the database.
  def self.save_trades(live_trades, trades)
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
            Rails.logger.error "Error saving trade: #{trade.inspect}, #{e}"
            trade.error = live_trade.error
          end
        else
          trade.error = live_trade.error
        end
      end
    end
    Rails.logger.debug "NEW PRICES SAVED: #{saved_trades_ctr}."
  end
end
