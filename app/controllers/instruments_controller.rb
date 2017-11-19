# This controller handles requests for Instrument data.
class InstrumentsController < ApplicationController

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
    logger.info 'INSTRUMENT BULK LOAD REQUESTED.'
    FeedWorker.perform_async('instrument_bulk_load')
    head :accepted
  end
end
