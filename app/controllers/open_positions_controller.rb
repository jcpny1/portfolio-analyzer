class OpenPositionsController < ApplicationController
  before_action :get_portfolio, except: [:index]

  # Add a new open position to a portfolio and save it to the database.
  def create
    @portfolio.open_positions.new(open_position_params)
    if @portfolio.save
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Commit open position edits to the database.
  def update
    if @portfolio.open_positions.find(params[:id]).update(open_position_params)
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Delete an open position.
  def destroy
    if @portfolio.open_positions.destroy(params[:id])
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  # Load the portfolio identified in the route.
  def get_portfolio
    @portfolio = Portfolio.find_by(id: params[:portfolio_id])
  end

  # Filter params for allowed elements only.
  def open_position_params
    params.require(:open_position).permit(:stock_symbol_id, :quantity, :cost, :date_acquired)
  end
end
