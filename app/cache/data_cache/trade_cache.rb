# This class is responsible for interfacing the outside world with the Trade data store.
class TradeCache
  # Retrieve the latest prices for the given instrument list.
  # Specify get_live_prices to retrieve feed data. Otherwise, just get prices from database.
  def self.prices(instruments, get_live_prices, bulk_load = false)
    trades = []
    instruments.each_slice(DataCache::TRADE_BATCH_SIZE) do |instrument_batch|
      trade_batch = prices_from_database(instrument_batch)  # Get database prices as a baseline.
      if get_live_prices
        Feed.load_prices(instrument_batch) do |live_trades|  # Get feed prices.
          save_trades(trade_batch, live_trades)  # Update database prices with feed prices.
        end
      end
      if !bulk_load
        trades.concat(trade_batch)
      # else
        # sleep DataCache::TRADE_BATCH_DELAY  # Throttle requests for bulk loads.
      end
    end
    trades
  end

  ### private ###

  # Fetch database trades
  private_class_method def self.prices_from_database(instruments)
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
  private_class_method def self.save_trades(trades, live_trades)
    saved_trades_ctr = 0
    Trade.transaction do
      live_trades.each do |live_trade|
        trade = trades.find { |trade| trade.instrument.symbol == live_trade.instrument.symbol }
        next if trade.nil?  # we got an instrument that we didn't request!
        if live_trade.trade_price.nil?  # The feed glitched.
          trade.error = live_trade.error
        else
          begin
            if Trade.dataChanged?(trade, live_trade)
              Trade.dataUpdate(trade, live_trade)
              saved_trades_ctr += 1
            end
          rescue ActiveRecord::ActiveRecordError => e
            Rails.logger.error "Error saving trade: #{trade.inspect}, #{e}."
            trade.error = live_trade.error
          end
        end
      end
    end
    Rails.logger.debug "NEW PRICES SAVED: #{saved_trades_ctr}."
  end
end
