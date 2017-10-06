class Portfolio < ApplicationRecord
  belongs_to :user

  has_many :open_positions

  validates :name, presence: true
  validates :name, uniqueness: {scope: :user, message: "already exists"}

  # Returns the sum of the cost values of all the portfolio's open positions.
  def sumCost
    self.open_positions.reduce(0.0) { |sum, open_position|
      sum + open_position.cost
    }
  end

  # Returns the sum of the cost values of all the portfolio's open positions.
  def sumMarketValue
    self.open_positions.reduce(0.0) { |sum, open_position|
      sum + (open_position.lastClosePrice * open_position.quantity)
    }
  end

end
