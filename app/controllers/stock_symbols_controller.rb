class StockSymbolsController < ApplicationController
  # Retrieve all stock symbols.
  def index
    render json: StockSymbol.all
  end
end
