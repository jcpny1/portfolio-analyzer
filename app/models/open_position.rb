class OpenPosition < ApplicationRecord
  belongs_to :portfolio
  belongs_to :stock_symbol
end
