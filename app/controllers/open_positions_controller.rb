class OpenPositionsController < ApplicationController
  before_action :get_portfolio

  # Update an existing open position in or add a new open position to a portfolio.
  def update
    if !params[:open_position_id].blank?
      open_position = @portfolio.open_positions.find(params[:open_position_id])
    else
      open_position = @portfolio.open_positions.new
    end

    if open_position.update(open_position_params)
      render json: open_position
    else
      render json: open_position.errors, status: :unprocessable_entity
    end
  end

  # Delete an open position.
  def destroy
    if @portfolio.open_positions.find(params[:open_position_id]).destroy
      render json: JSON.parse('{"msg":"position deleted"}'), status: :ok
    else
      render json: @portfolio.errors, status: :unprocessable_entity
    end
  end

  private

  # Load the portfolio identified in the route.
  def get_portfolio
    @portfolio = Portfolio.find_by(id: params[:id])
  end

  # Filter params for allowed elements only.
  def open_position_params
    params.require(:open_position).permit(:portfolio_id, :stock_symbol_id, :quantity, :cost, :date_acquired)
  end
end
