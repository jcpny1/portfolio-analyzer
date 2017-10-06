class PortfoliosController < ApplicationController
  # Retrieve all portfolios. Augment with Portfolio valuations.
  def index
    portfolios = Portfolio.all.map { |portfolio|
      p = portfolio.attributes
      p['marketValue'] = portfolio.sumMarketValue
      p['totalCost'] = portfolio.sumCost
      p
    }
    render json: portfolios
  end

  # Retrieve a portfolio (with open_positions).
  def show
    portfolio_id = params[:id]
    portfolio = Portfolio.find_by(id: portfolio_id)
    render json: portfolio
  end
end
