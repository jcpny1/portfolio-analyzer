class StockSymbol < ApplicationRecord
  belongs_to :company

  has_many :daily_trades
  has_many :open_positions

  validates :name, presence: true
  validates :name, uniqueness: {case_sensitive: false}

  # Returns the latest closing price available or 0.
  def lastClosePrice
    last_close_record = DailyTrade.where('stock_symbol_id = ?', self.id).order('trade_date DESC').first
    last_close_record.present? ? last_close_record.close_price : 0.0
  end
end
