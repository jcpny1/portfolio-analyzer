module Adapter
  Dir[File.dirname(__FILE__) + '/adapter/*.rb'].each {|file| require file }

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

  # Feeds that don't have a trade_date should use `Time.at(0).to_datetime` for the trade_date.
  def self.missing_trade_date
    Time.at(0).to_datetime
  end
end
