class StockSymbolsController < ApplicationController
  # Retrieve all stock symbols.
  def index
    render json: StockSymbol.limit(100)
  end
end
