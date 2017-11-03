class StockSymbolsController < ApplicationController
  # Retrieve stock_symbol by name.
  def by_name
    name = params[:name]
    if name.blank?
      render json: {error: 'Expected parameter `name` '}, status: :bad_request
    else
      render json: StockSymbol.where("name = ?", name)
    end
  end
end
