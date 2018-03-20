# This module handles external data feed processing.
# At this time, it is expected that it will only be used by datacache classes to refresh cache data.
# All requests for feed data should go through these methods.
module Feed
  Dir[File.dirname(__FILE__) + '/feed/*.rb'].each { |file| require file }

  # NOTE: Feeds that don't have a trade_date will use `Time.at(0).to_datetime` for the trade_date.

  # Retrieve news headlines.
  def self.headlines
    Feed::NewsAPI.headlines
  end

  # For each symbol, fetch live feed index values.
  # Returns array of index values.
  def self.load_indexes(symbols)
    Rails.logger.debug 'FETCH INDEXES BEGIN.'
    indexes = Feed::AV.latest_trades(symbols)  # Get the feed's value data.
    Rails.logger.debug "FETCH INDEXES END (requested: #{symbols.length}, received: #{indexes.length})."
    indexes
  end

  # For each instrument, fetch live feed price values.
  # Yields result to caller.
  def self.load_prices(instruments)
    Rails.logger.debug 'FETCH PRICES BEGIN.'
    symbols = instruments.map(&:symbol)
    trades = Feed::IEX.latest_trades(symbols)  # Get the feed's price data.
    Rails.logger.debug "FETCH PRICES END (requested: #{symbols.length}, received: #{trades.length})."
    yield trades
  end

  # For each symbol, fetch live feed series values.
  # Returns array of series values.
  def self.load_series(symbols)
    Rails.logger.debug 'FETCH SERIES BEGIN.'
    series = Feed::AV.monthly_series(symbols)  # Get the feed's series data.
    Rails.logger.debug "FETCH SERIES END (requested: #{symbols.length}, received: #{series.length})."
    yield series
  end

  # Return the feed handler's symbology.
  def self.symbology
    Feed::IEX.symbology  # Call feed handler to retrieve symbology.
  end

  ### FOR USE BY FEED HANDLERS ###

  # Create a series that signifies an error has occurred.
  def self.error_series(symbol, error_msg)
    Series.new(instrument: Instrument.new(symbol: symbol), error: "#{symbol}: #{error_msg}")
  end

  # Create a trade that signifies an error has occurred.
  def self.error_trade(symbol, error_msg)
    Trade.new(instrument: Instrument.new(symbol: symbol), error: "#{symbol}: #{error_msg}")
  end

  # Create error series for all symbols.
  def self.fetch_series_failure(symbols, series, error_msg)
    symbols.each_with_index do |symbol, i|
      series[i] = error_series(symbol, error_msg)
    end
  end

  # Create error trades for all symbols.
  def self.fetch_trade_failure(symbols, trades, error_msg)
    symbols.each_with_index do |symbol, i|
      trades[i] = error_trade(symbol, error_msg)
    end
  end

  # Feeds that don't have a trade_date should use `Time.at(0).to_datetime` for the trade_date.
  def self.missing_trade_date
    Time.at(0).to_datetime
  end
end
