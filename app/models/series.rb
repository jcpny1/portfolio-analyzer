# A Series, for this application, represents an array of price points in time for a specific Instrument.
class Series < ApplicationRecord
  belongs_to :instrument
  attr_accessor :error

  # Compare two series data points for differences.
  def self.dataChanged?(dp1, dp2)
    (dp1.close_price     != dp2.close_price)     ||
    (dp1.open_price      != dp2.open_price)      ||
    (dp1.high_price      != dp2.high_price)      ||
    (dp1.low_price       != dp2.low_price)       ||
    (dp1.volume          != dp2.volume)          ||
    (dp1.dividend_amount != dp2.dividend_amount) ||
    (dp1.series_date     != dp2.series_date)     ||
    (dp1.time_interval   != dp2.time_interval)   ||
    (dp1.instrument_id   != dp2.instrument_id)   ||
    (dp1.adjusted_close_price != dp2.adjusted_close_price)
  end

  # Update tgt attributes from src, then save.
  # Could throw ActiveRecord::ActiveRecordError.
  def self.dataUpdate(tgt, src)
    tgt.close_price     = src.close_price
    tgt.open_price      = src.open_price
    tgt.high_price      = src.high_price
    tgt.low_price       = src.low_price
    tgt.volume          = src.volume
    tgt.dividend_amount = src.dividend_amount
    tgt.series_date     = src.series_date
    tgt.time_interval   = src.time_interval
    tgt.instrument_id   = src.instrument_id
    tgt.adjusted_close_price = src.adjusted_close_price
    tgt.save!
  end
end
