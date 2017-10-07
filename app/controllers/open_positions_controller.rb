class OpenPositionsController < ApplicationController
  before_action :get_portfolio

  # Update an existing open position in or add a new open position to a portfolio.
  def update
    stock_symbol = StockSymbol.find_by(name: params[:stock_symbol_name])
    open_position = @portfolio.open_positions.find_or_initialize_by(stock_symbol_id: stock_symbol.id)
    if open_position.update(open_position_params)
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
