class PortfoliosController < ApplicationController
  # Retrieve all portfolios. Augment with Portfolio valuations.
  def index
    render json: Portfolio.all
  end
  # Retrieve a portfolio (with open_positions).
  def show
    portfolio_id = params[:id]
    portfolio = Portfolio.find_by(id: portfolio_id)
    portfolio.updateValuation
    render json: portfolio
  end
end
