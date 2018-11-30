# This controller handles requests for Trade data.
class TradesController < ApplicationController
  # Retrieve the latest index values for the symbols specified in params.
  def last_index
    logger.info 'LAST INDEX LOAD BEGIN.'
    indexes = DataCache.index_values(params[:symbols].split(','))
    logger.info 'LAST INDEX LOAD END.'
    render json: indexes, each_serializer: IndexSerializer
  end

  # Retrieve the latest prices for the symbols used by current user.
  # Specify param 'livePrices' to supplement database prices with feed prices. Otherwise, only return database prices.
  def last_price
    logger.info 'LAST PRICE LOAD BEGIN.'
    instruments = Instrument.select(:id, :symbol).joins(positions: :portfolio).where(portfolios: { user_id: current_user.id }).order(:symbol).distinct  # Get instrument list. Added .order for WebMock testing.
    trades = DataCache.price_values(instruments, params.key?('livePrices'))
    logger.info 'LAST PRICE LOAD END.'
    render json: trades, each_serializer: TradeSerializer
  end

  # Update last price data for every instrument in the database.
  # Intended for admin user only.
  def price_bulk_load
    logger.info 'PRICE BULK LOAD REQUESTED.'
    FeedWorker.perform_async('price_bulk_load')
    head :accepted
  end
end
