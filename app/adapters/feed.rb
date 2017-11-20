module Feed
  Dir[File.dirname(__FILE__) + '/feed/*.rb'].each {|file| require file }

  # NOTE: Feeds that don't have a trade_date will use `Time.at(0).to_datetime` for the trade_date.

  # NOTE: Some feeds have a per-request symbol limit. The limit on IEX is 100. Let's stay well under that for now.
  BATCH_FETCH_SIZE = 50

  # Create a trade that signifies an error has occurred.
  def self.error_trade(symbol, error_msg)
    Trade.new(instrument: Instrument.new(symbol: symbol), error: "#{symbol}: #{error_msg}")
  end

  # Create error trades for all symbols.
  def self.fetch_failure(symbols, trades, error_msg)
    symbols.each_with_index do |symbol, i|
      trades[i] = error_trade(symbol, error_msg)
    end
  end

  # For each trade record, fetch live feed price values.
  def self.load_prices(instruments)
    Rails.logger.info 'FETCH PRICES BEGIN.'
    received_ctr = 0
    requested_ctr = 0
    all_trades = []
    instruments.each_slice(BATCH_FETCH_SIZE) do |instrument_batch|
      sleep 1 if requested_ctr.nonzero?               # Do not slam our feed vendor and get throttled or blocked.
      symbols = instrument_batch.map(&:symbol)
      requested_ctr += symbols.length                 # Update requested counter.
      live_trades = Feed::IEX.latest_trades(symbols)  # Get the feed's price data.
      received_ctr += live_trades.length              # Update fetched counter.
      all_trades.concat(live_trades)
    end
    Rails.logger.info "FETCH PRICES END (requested: #{requested_ctr}, received: #{received_ctr})."
    all_trades
  end

  # Feeds that don't have a trade_date should use `Time.at(0).to_datetime` for the trade_date.
  def self.missing_trade_date
    Time.at(0).to_datetime
  end
end
