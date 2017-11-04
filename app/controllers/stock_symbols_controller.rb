class StockSymbolsController < ApplicationController
  include InvestorsExchange  # include Feed handler here.

  # Retrieve stock_symbol by name.
  def by_name
    name = params[:name]
    if name.blank?
      render json: {error: 'Expected parameter `name` '}, status: :bad_request
    else
      render json: StockSymbol.where("name = ?", name)
    end
  end

  def refresh
    # Call feed handler to refresh.
    getSymbology();
    render json: {}, status: :ok
  end
end
