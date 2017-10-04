class PortfoliosController < ApplicationController
  # Retrieve all portfolios. Augment with Portfolio valuations.
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
    portfolio = Portfolio.first
    render( status: 200, json: portfolio)
  end
end
