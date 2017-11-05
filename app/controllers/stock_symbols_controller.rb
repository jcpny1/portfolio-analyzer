class StockSymbolsController < ApplicationController
  include InvestorsExchange  # include Feed handler here.

  # Retrieve stock_symbols by [partial] long name.
  def by_long_name
    q = params[:q]
    if q.blank?
      render json: {error: 'Expected parameter `q` '}, status: :bad_request
    else
      render json: StockSymbol.where("upper(long_name) LIKE ?", "%#{q.upcase}%").order(:long_name).limit(10)
    end
  end

  # Retrieve stock_symbols by name.
  def by_name
    name = params[:name]
    if name.blank?
      render json: {error: 'Expected parameter `name` '}, status: :bad_request
    else
      render json: StockSymbol.where("name = ?", name)
    end
  end

  def refresh
    # Call feed handler to retrieve symbology.
    symbolHash = getSymbology();
    render json: {}, status: :ok
  end
end
