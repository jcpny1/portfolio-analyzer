class PortfoliosController < ApplicationController
  # Retrieve all portfolios. Augment with Portfolio valuations.
  def index
    portfolios = Portfolio.all.map { |portfolio|
      p = portfolio.attributes
      p['marketValue'] = portfolio.sumMarketValue
      p['totalCost'] = portfolio.sumCost
      p
    }
    render( status: 200, json: portfolios)
  end

  # Retrieve a portfolio (with open_positions). Augment open_positions with last_close price.
  def show
    portfolio_id = params[:id]
    portfolio = Portfolio.find_by(id: portfolio_id)
    render( status: 200, json: portfolio)
  end
end
