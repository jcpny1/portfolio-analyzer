class StockSymbolsController < ApplicationController
  include InvestorsExchange  # include Feed handlers here.

  # Retrieve stock_symbols by specified column name and value.
  # Use param 'exact' for 'equals' condition. Leave off for 'like'.
  def index
    value = params[:v]
    if params.key?('exact')
      render json: StockSymbol.where("name = '%s'", value)
    else
      value = "%#{value.upcase}%"
      render json: StockSymbol.where("upper(name) LIKE '%s' OR upper(long_name) LIKE '%s'", value, value).order(:name).limit(20)
    end
  end

  # Refresh stock_symbols database table from feed symbology.
  def refresh_from_feed
    symbols_added   = 0
    symbols_errored = 0
    symbols_skipped = 0
    symbols_updated = 0
    symbol_hash_array = IEX_symbology()   # Call feed handler to retrieve symbology.
    StockSymbol.transaction do
      symbol_hash_array.each do |symbol|
        begin
          stock_symbol = StockSymbol.where('name = ?', symbol['symbol']).first
          if stock_symbol.nil?
            StockSymbol.create!(name: symbol['symbol'], long_name: symbol['name'])
            symbols_added += 1
          elsif !symbol['name'].casecmp?(stock_symbol.long_name)
            stock_symbol.update!(long_name: symbol['name'])
            symbols_updated += 1
          else
            symbols_skipped += 1
          end
        rescue ActiveRecord::ActiveRecordError => e
          logger.error "STOCK SYMBOL REFRESH: Error saving stock symbol: #{symbol.inspect}, #{e}"
          symbols_errored += 1
        end
      end
    end
    logger.info "STOCK SYMBOLS REFRESH (processed: #{symbol_hash_array.length}, added: #{symbols_added}, updated: #{symbols_updated}, skipped: #{symbols_skipped}, errors: #{symbols_errored})."
    head :ok
  end
end
