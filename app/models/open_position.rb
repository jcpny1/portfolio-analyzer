class OpenPosition < ApplicationRecord
  belongs_to :portfolio, inverse_of: :open_positions
  belongs_to :stock_symbol
end
