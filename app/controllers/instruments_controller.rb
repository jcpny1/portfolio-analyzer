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
  # Intended for admin user only.
  def instrument_bulk_load
    logger.info 'INSTRUMENT BULK LOAD BEGIN.'
    added   = 0
    errored = 0
    skipped = 0
    updated = 0
    feed_records = IEX_symbology()   # Call feed handler to retrieve symbology.
    Instrument.transaction do
      feed_records.each do |feed_record|
        begin
          instrument = Instrument.where('symbol = ?', feed_record['symbol']).first
          if instrument.nil?
            Instrument.create!(symbol: feed_record['symbol'], name: feed_record['name'])
            added += 1
          elsif !feed_record['name'].casecmp?(instrument.name)
            instrument.update!(name: feed_record['name'])
            updated += 1
          else
            skipped += 1
          end
        rescue ActiveRecord::ActiveRecordError => e
          logger.error "INSTRUMENT REFRESH: Error saving stock symbol: #{symbol_record.inspect}, #{e}"
          errored += 1
        end
      end
    end
    logger.info "INSTRUMENT BULK LOAD END (received: #{feed_records.length}, added: #{added}, updated: #{updated}, skipped: #{skipped}, errors: #{errored})."
    head :ok
  end
end
