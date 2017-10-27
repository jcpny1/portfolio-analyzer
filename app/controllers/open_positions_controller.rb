class OpenPositionsController < ApplicationController
  before_action :get_portfolio, except: [:index]

  # Add a new open position to a portfolio and save it to the database.
  def create
    input_params = add_param_symbol_id
    @portfolio.open_positions.new(input_params)
    if @portfolio.save
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Commit open position edits to the database.
  def update
    input_params = add_param_symbol_id
    if @portfolio.open_positions.find(params[:id]).update(input_params)
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

  # Derive stock_symbol_id from params stock_symbol_name.
  def add_param_symbol_id
    result = open_position_params.clone;
    stock_symbol = StockSymbol.find_by(name: params['stock_symbol_name'])
    # TODO return error if symbol is not valid.
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
  def open_position_params
    params.require(:open_position).permit(:stock_symbol_name, :quantity, :cost, :date_acquired)
  end
end
