class OpenPosition < ApplicationRecord
  belongs_to :portfolio, inverse_of: :open_positions
  belongs_to :stock_symbol
  validates :cost, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }
  validates :date_acquired, presence: { message: "is not valid" }
end
