class Portfolio < ApplicationRecord
  belongs_to :user
  has_many :open_positions
  validates :name, presence: true
  validates :name, uniqueness: { scope: :user, message: "already exists" }

  # returns the sum of the cost values of all the portfolio's open positions.
  def sumCost
    self.open_positions.reduce(0.0) { |sum, open_position|
      sum + open_position.cost
    }
  end

  # returns the sum of the cost values of all the portfolio's open positions.
  def sumMarketValue
    self.open_positions.reduce(0.0) { |sum, open_position|
      sum + (DailyTrade.where('stock_symbol_id = ?', open_position.stock_symbol_id).order('trade_date DESC').first.close_price * open_position.quantity)
    }
  end

end
