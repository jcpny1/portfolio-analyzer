class PortfoliosController < ApplicationController
  # Retrieve all portfolios.
  def index
    portfolios = Portfolio.all.map { |portfolio|
      p = portfolio.attributes;
      p['marketValue'] = portfolio.sumMarketValue
      p['totalCost'] = portfolio.sumCost
      p;
    }
    render( status: 200, json: portfolios)
  end

  # Retrieve a portfolio.
  def show
    positions = Portfolio.first.open_positions
    render( status: 200, json: positions)
  end
end
