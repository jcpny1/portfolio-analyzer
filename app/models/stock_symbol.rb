class StockSymbol < ApplicationRecord
  belongs_to :company

  has_many :daily_trades
  has_many :open_positions

  validates :name, presence: true
  validates :name, uniqueness: { case_sensitive: false }
end
