class OpenPosition < ApplicationRecord
  belongs_to :portfolio, inverse_of: :open_positions
  belongs_to :stock_symbol

  # Returns the latest closing price available or 0.
  def lastClosePrice
    self.stock_symbol.lastClosePrice
  end
end
