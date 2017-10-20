class Portfolio < ApplicationRecord
  belongs_to :user
  has_many :open_positions, dependent: :destroy, inverse_of: :portfolio
  validates :name, presence: true
  validates :name, uniqueness: {scope: :user, message: "already exists"}

  # In-memory-only values.
  attr_reader :gainLoss, :marketValue, :totalCost

  # Set an initial valuation on the portfolio.
  after_initialize do |portfolio|
    portfolio.updateValuation
  end

  # Sets the sum of the cost and market values of all the portfolio's open positions.
  def updateValuation
    @marketValue = 0.0
    @totalCost   = 0.0;
    self.open_positions.each { |open_position|
      @marketValue += open_position.marketValue
      @totalCost   += open_position.cost
    }
    @gainLoss = @marketValue - @totalCost
  end
end
