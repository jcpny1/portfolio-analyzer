# A Trade, for this application, represents a specific sale of a particular Instrument.
# The feeds available to this application may not enumerate every trade, but will just provide
# the latest sales data at a given time.
class Trade < ApplicationRecord
  belongs_to :instrument
  attr_accessor :error

  # Compare two trades for differences.
  def self.dataChanged?(t1, t2)
    (t1.trade_price != t2.trade_price) || (t1.trade_date < t2.trade_date)
  end

  # Update tgt attributes from src, then save.
  # Could throw ActiveRecord::ActiveRecordError.
  def self.dataUpdate(tgt, src)
    tgt.trade_date   = src.trade_date
    tgt.trade_price  = src.trade_price
    tgt.price_change = src.price_change
    tgt.created_at   = src.created_at
    tgt.save!
  end
end
