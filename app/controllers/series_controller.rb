# This controller handles requests for Series data.
class SeriesController < ApplicationController
  # Retrieve the monthly series values for the symbols specified in params.
  def monthly_series
    logger.info 'MONTHLY SERIES LOAD BEGIN.'
    series = DataCache.monthly_series(params[:symbols].split(','))
# TODO remove this is code when records get their own ids.
# Create unique id's for AMS. These records didn't come through ActiveRecord.
i = 0
series.each { |s|
  s.id = i
  i += 1
}
    logger.info 'MONTHLY SERIES LOAD END.'
    render json: series, each_serializer: SeriesSerializer, include: 'instrument'
  end
end
