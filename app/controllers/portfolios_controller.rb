class PortfoliosController < ApplicationController
  # Retrieve all portfolios.
  def index
    render json: Portfolio.all
  end

  # Retrieve a portfolio.
  def show
    portfolio = Portfolio.find(params[:id])
    portfolio.updateValuation
    render json: portfolio
  end

  # Create a new portfolio and save it to the database.
  def create
    portfolio = Portfolio.new(portfolio_params)
    if portfolio.save
      render json: portfolio
    else
      render json: portfolio.errors, status: :unprocessable_entity
    end
  end

  # Update an existing portfolio.
  def update
    portfolio = Portfolio.find(params[:id])
    if portfolio.update(portfolio_params)
      render json: portfolio
    else
      render json: portfolio.errors, status: :unprocessable_entity
    end
  end

  # Delete a portfolio.
  def destroy
    portfolio = Portfolio.find(params[:id])
    if portfolio.destroy
      render json: JSON.parse('{"msg":"portfolio deleted"}'), status: :ok
    else
      render json: portfolio.errors, status: :unprocessable_entity
    end
  end

  private

  # Filter params for allowed elements only.
  def portfolio_params
    params.require(:portfolio).permit(:user_id, :name)
  end
end
