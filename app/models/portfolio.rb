class Portfolio < ApplicationRecord
  belongs_to :user

  has_many :open_positions

  validates :name, presence: true
  validates :name, uniqueness: {scope: :user, message: "already exists"}

  # in-memory-only values.
  attr_reader :marketValue, :totalCost

  # Set an initial valuation on the portfolio.
  after_initialize do |portfolio|
    portfolio.updateValuation
  end

  # Sets the sum of the cost values of all the portfolio's open positions.
  def updateMarketValue
    @marketValue = self.open_positions.reduce(0.0) { |sum, open_position|
      sum + (open_position.lastClosePrice * open_position.quantity)
    }
  end

  # Sets the sum of the cost values of all the portfolio's open positions.
  def updateTotalCost
    @totalCost = self.open_positions.reduce(0.0) { |sum, open_position|
      sum + open_position.cost
    }
  end

  def updateValuation
puts "UPDATING VALUATION"
    self.updateMarketValue
    self.updateTotalCost
  end

end
