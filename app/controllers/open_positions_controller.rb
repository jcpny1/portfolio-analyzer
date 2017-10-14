class OpenPositionsController < ApplicationController
  before_action :get_portfolio, except: [:index]

  # Add a new open position to a portfolio.
  def create
    open_position = @portfolio.open_position.new(open_position_params)
    if open_position.save
      render json: open_position
    else
      render json: open_position.errors, status: :unprocessable_entity
    end
  end

  # Commit open position edits to the database.
  def update
    open_position = @portfolio.open_positions.find(params[:id])
    if open_position.update(open_position_params)
      render json: open_position
    else
      render json: open_position.errors, status: :unprocessable_entity
    end
  end

  # Remove an open position from a portfolio and delete it.
  def destroy
    open_position = @portfolio.open_positions.find(params[:id])
    if open_position.destroy
      render json: JSON.parse('{"msg":"position deleted"}'), status: :ok
    else
      render json: @portfolio.errors, status: :unprocessable_entity
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
