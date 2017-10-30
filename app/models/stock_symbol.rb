class StockSymbol < ApplicationRecord
  belongs_to :company
  has_many :trades
  has_many :positions
  validates :name, presence: { message: "is not valid" }
  validates :name, uniqueness: {case_sensitive: false}
end
