module Feed
  Dir[File.dirname(__FILE__) + '/feed/*.rb'].each {|file| require file }

  # NOTE: Feeds that don't have a trade_date will use `Time.at(0).to_datetime` for the trade_date.

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
  # Yields result to caller.
  def self.load_prices(instruments)
    Rails.logger.debug 'FETCH PRICES BEGIN.'
    symbols = instruments.map(&:symbol)
    trades = Feed::IEX.latest_trades(symbols)  # Get the feed's price data.
    Rails.logger.debug "FETCH PRICES END (requested: #{symbols.length}, received: #{trades.length})."
    yield trades
  end

  # Feeds that don't have a trade_date should use `Time.at(0).to_datetime` for the trade_date.
  def self.missing_trade_date
    Time.at(0).to_datetime
  end
end
