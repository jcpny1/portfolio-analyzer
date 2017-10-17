class PortfoliosController < ApplicationController
  before_action :get_portfolio, except: [:index, :create]

  # Retrieve all portfolios.
  def index
    render json: Portfolio.all
  end

  # Retrieve a portfolio.
  def show
    @portfolio.updateValuation
    render json: @portfolio
  end

  # Create a new portfolio and save it to the database.
  def create
    portfolio = Portfolio.new(portfolio_params)
    if portfolio.save
      render json: portfolio
    else
      render json: portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Commit portfolio edits to the database.
  def update
    if @portfolio.update(portfolio_params)
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Delete a portfolio.
  def destroy
    if @portfolio.destroy
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  # Load the portfolio identified in the route.
  def get_portfolio
    @portfolio = Portfolio.find(params[:id])
  end

  # Filter params for allowed elements only.
  def portfolio_params
    params.require(:portfolio).permit(:user_id, :name)
  end
end
