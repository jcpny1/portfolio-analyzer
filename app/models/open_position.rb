class OpenPosition < ApplicationRecord
  belongs_to :portfolio, inverse_of: :open_positions
  belongs_to :stock_symbol

  # Returns the latest gainLoss value.
  def gainLoss
    self.marketValue - self.cost
  end

  # Returns the latest closing price available.
  def lastClosePrice
    self.stock_symbol.lastClosePrice
  end

  # Returns the current market value.
  def marketValue
    self.quantity * self.lastClosePrice
  end
end
