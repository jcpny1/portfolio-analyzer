# This controller handles requests for Series data.
class SeriesController < ApplicationController
  # Retrieve the monthly series values for the symbols specified in params.
  def monthly_series
    logger.info 'MONTHLY SERIES LOAD BEGIN.'
    series = DataCache.monthly_series(params[:symbols].split(','))
    logger.info 'MONTHLY SERIES LOAD END.'
    render json: series, each_serializer: SeriesSerializer
  end
end
