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
end
