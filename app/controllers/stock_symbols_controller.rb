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
    symbolsAdded = 0
    symbolsErrored = 0
    symbolsUpdated = 0
    symbolHashArray = getSymbology();   # Call feed handler to retrieve symbology.
    StockSymbol.transaction do
      symbolHashArray.each { |symbol|
        begin
          stockSymbol = StockSymbol.where('name = ?', symbol['symbol']).first
          if stockSymbol.nil?
            StockSymbol.create(name: symbol['symbol'], long_name: symbol['name'])
            symbolsAdded += 1
          elsif symbol['name'].upcase != stockSymbol.long_name.upcase
            stockSymbol.update(long_name: symbol['name'])
            symbolsUpdated += 1
          end
        rescue ActiveRecord::ActiveRecordError => e
          logger.error "STOCK SYMBOL REFRESH: Error saving stock symbol: #{symbol.inspect}, #{e}"
          symbolsErrored += 1
        end
      }
    end
    logger.info "STOCK SYMBOLS REFRESH (processed: #{symbolHashArray.length}, added: #{symbolsAdded}, updated: #{symbolsUpdated}, errors: #{symbolsErrored})."
    render json: {}, status: :ok
  end
end
