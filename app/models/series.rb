# A Series, for this application, represents an array of price points in time for a specific Instrument.
class Series < ApplicationRecord
  belongs_to :instrument
  attr_accessor :error

  # Compare two series for differences.
  def changed?(compare)
    (instrument_id   != compare.instrument_id) ||
    (time_interval   != compare.time_interval) ||
    (series_date     != compare.series_date)   ||
    (open_price      != compare.open_price)    ||
    (high_price      != compare.high_price)    ||
    (low_price       != compare.low_price)     ||
    (close_price     != compare.close_price)   ||
    (adjusted_close_price != compare.adjusted_close_price) ||
    (volume          != compare.volume)        ||
    (dividend_amount != compare.dividend_amount)
  end
end
