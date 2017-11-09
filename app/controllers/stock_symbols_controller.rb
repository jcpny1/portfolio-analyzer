class StockSymbolsController < ApplicationController
  include InvestorsExchange  # include Feed handler here.

  # Retrieve stock_symbols by specified column name and value.
  # Use param 'exact' for 'equals' condition. Leave off for 'like'.
  def index
    value = params[:v]
    if params.key?("exact")
      render json: StockSymbol.where("name = '%s'", value)
    else
      value = "%#{value.upcase}%"
      render json: StockSymbol.where("upper(name) LIKE '%s' OR upper(long_name) LIKE '%s'", value, value).order(:name).limit(20)
    end
  end

  # Refresh stock_symbols database table from feed symbology.
  def refresh_from_feed
    symbolsAdded   = 0
    symbolsErrored = 0
    symbolsUpdated = 0
    symbolHashArray = getSymbology()   # Call feed handler to retrieve symbology.
    StockSymbol.transaction do
      symbolHashArray.each { |symbol|
        begin
          stockSymbol = StockSymbol.where('name = ?', symbol['symbol']).first
          if stockSymbol.nil?
            StockSymbol.create!(name: symbol['symbol'], long_name: symbol['name'])
            symbolsAdded += 1
          elsif symbol['name'].upcase != stockSymbol.long_name.upcase
            stockSymbol.update!(long_name: symbol['name'])
            symbolsUpdated += 1
          end
        rescue ActiveRecord::ActiveRecordError => e
          logger.error "STOCK SYMBOL REFRESH: Error saving stock symbol: #{symbol.inspect}, #{e}"
          symbolsErrored += 1
        end
      }
    end
    logger.info "STOCK SYMBOLS REFRESH (processed: #{symbolHashArray.length}, added: #{symbolsAdded}, updated: #{symbolsUpdated}, errors: #{symbolsErrored})."
    head :ok
  end
end
