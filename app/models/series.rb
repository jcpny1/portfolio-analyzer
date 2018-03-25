# A Series, for this application, represents an array of price points in time for a specific Instrument.
class Series < ApplicationRecord
  belongs_to :instrument
  attr_accessor :error

  # Compare two series data points for differences.
  def changed?(compare)
    (close_price     != compare.close_price)     ||
    (open_price      != compare.open_price)      ||
    (high_price      != compare.high_price)      ||
    (low_price       != compare.low_price)       ||
    (volume          != compare.volume)          ||
    (dividend_amount != compare.dividend_amount) ||
    (series_date     != compare.series_date)     ||
    (time_interval   != compare.time_interval)   ||
    (instrument_id   != compare.instrument_id)   ||
    (adjusted_close_price != compare.adjusted_close_price)
  end
end
