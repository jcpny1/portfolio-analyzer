class OpenPositionsController < ApplicationController
  before_action :get_portfolio

  # Add a new open position to a portfolio.
  def create
    open_position = @portfolio.open_positions.new(open_position_params)
    if open_position.save
      render json: open_position
    else
      render json: open_position.errors, status: :unprocessable_entity
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
