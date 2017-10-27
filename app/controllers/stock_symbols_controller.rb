class StockSymbolsController < ApplicationController
  # Retrieve all stock symbols.
  def index
    render json: StockSymbol.limit(250)
  end
end
