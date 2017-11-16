# This controller handles requests for Instrument data.
class InstrumentsController < ApplicationController
  include InvestorsExchange  # include Feed handlers here.

  # Retrieve instruments by specified value.
  # Specify param 'exact' to use 'equals' on the symbol column in the WHERE clause.
  # Otherwise, 'like' will be used against the symbol and name columns.
  def index
    value = params[:v]
    if params.key?('exact')
      render json: Instrument.where("symbol = '%s'", value)
    else
      value = "%#{value.upcase}%"
      render json: Instrument.where("upper(symbol) LIKE '%s' OR upper(name) LIKE '%s'", value, value).order(:name).limit(20)
    end
  end

  # Refresh instruments database table from feed symbology.
  def refresh_from_feed
    instruments_added   = 0
    instruments_errored = 0
    instruments_skipped = 0
    instruments_updated = 0
    symbology = IEX_symbology()   # Call feed handler to retrieve symbology.
    Instrument.transaction do
      symbology.each do |symbol_record|
        begin
          instrument = Instrument.where('symbol = ?', symbol_record['symbol']).first
          if instrument.nil?
            Instrument.create!(symbol: symbol_record['symbol'], name: symbol_record['name'])
            instruments_added += 1
          elsif !symbol_record['name'].casecmp?(instrument.name)
            instrument.update!(name: symbol_record['name'])
            instruments_updated += 1
          else
            instruments_skipped += 1
          end
        rescue ActiveRecord::ActiveRecordError => e
          logger.error "INSTRUMENT REFRESH: Error saving stock symbol: #{symbol_record.inspect}, #{e}"
          instruments_errored += 1
        end
      end
    end
    logger.info "INSTRUMENT REFRESH (processed: #{symbology.length}, added: #{instruments_added}, updated: #{instruments_updated}, skipped: #{instruments_skipped}, errors: #{instruments_errored})."
    head :ok
  end
end
