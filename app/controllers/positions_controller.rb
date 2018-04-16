# This controller handles requests for Position data.
class PositionsController < ApplicationController
  before_action :portfolio, except: [:index]

  # Create a new position and save it to the database.
  def create
    input_params = add_param_instrument_id
    position = @portfolio.positions.new(input_params)
    if position.save
      FeedWorker.perform_async('series_bulk_load', nil, position.instrument.symbol)  # Update series for this symbol.
      render json: @portfolio
    else
      render json: position.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Commit position edits to the database.
  def update
    position = @portfolio.positions.find(params[:id])
    if position.instrument.symbol != params['instrument_symbol'] # Then we're changing instruments.
      position.instrument_id = nil
      input_params = add_param_instrument_id
      FeedWorker.perform_async('series_bulk_load', nil, params['instrument_symbol'])  # Update series for this symbol.
    else
      input_params = position_params
    end
    if position.update(input_params)
      render json: @portfolio
    else
      render json: position.errors.full_messages, status: :unprocessable_entity
    end
  end

  # Delete a position.
  def destroy
    if @portfolio.positions.destroy(params[:id])
      render json: @portfolio
    else
      render json: @portfolio.errors.full_messages, status: :unprocessable_entity
    end
  end

private

  # Derive instrument_id from params instrument_name.
  def add_param_instrument_id
    result = position_params.clone
    instrument = Instrument.find_by(symbol: params['instrument_symbol'])
    result['instrument_id'] = instrument.id unless instrument.nil?
    result
  end

  # Load the portfolio identified in the route.
  def portfolio
    @portfolio = Portfolio.find_by(id: params[:portfolio_id])
  end

  # Filter params for allowed attributes only.
  def position_params
    params.require(:position).permit(:instrument_id, :quantity, :cost, :date_acquired)
  end
end
