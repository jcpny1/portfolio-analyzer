class PositionsController < ApplicationController
  before_action :get_portfolio, except: [:index]

  # Add a new open position to a portfolio and save it to the database.
  def create
    input_params = add_param_symbol_id
    position = @portfolio.positions.new(input_params)
    if position.save
      render json: @portfolio
    else
      render json: position.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Commit open position edits to the database.
  def update
    position = @portfolio.positions.find(params[:id])
    if position.stock_symbol.name != params['stock_symbol_name'] # Then we're changing stock_symbols.
      position.stock_symbol_id = nil
      input_params = add_param_symbol_id
    else
      input_params = position_params
    end
    if position.update(input_params)
      render json: @portfolio
    else
      render json: position.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Delete an open position.
  def destroy
    if @portfolio.positions.destroy(params[:id])
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  # Derive stock_symbol_id from params stock_symbol_name.
  def add_param_symbol_id
    result = position_params.clone
    stock_symbol = StockSymbol.find_by(name: params['stock_symbol_name'])
    if !stock_symbol.nil?
      result['stock_symbol_id'] = stock_symbol.id
    end
    result
  end

  # Load the portfolio identified in the route.
  def get_portfolio
    @portfolio = Portfolio.find_by(id: params[:portfolio_id])
  end

  # Filter params for allowed elements only.
  def position_params
    params.require(:position).permit(:stock_symbol_id, :quantity, :cost, :date_acquired)
  end
end
