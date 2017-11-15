class StockSymbol < ApplicationRecord
  has_many :trades
  has_many :positions
  validates :name, presence: { message: 'is not valid' }
  validates :name, uniqueness: {case_sensitive: false}
end
