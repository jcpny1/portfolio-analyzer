# This controller handles requests for Trade data.
class TradesController < ApplicationController
  # Retrieve the latest index values for the symbols specified in params.
  def last_index
    logger.info 'LAST INDEX LOAD BEGIN.'
    trades = Feed::AV.latest_trades(params[:symbols].split(','))
    logger.info 'LAST INDEX LOAD END.'
    render json: trades, each_serializer: IndexSerializer
  end

  # Retrieve the latest prices for the symbols used by the supplied user_id.
  # Specify param 'livePrices' to supplement database prices with feed prices. Otherwise, only return database prices.
  def last_price
    logger.info 'LAST PRICE LOAD BEGIN.'
    instruments = Instrument.select(:id, :symbol).joins(positions: :portfolio).where(portfolios: { user_id: params['userId'] }).order(:symbol).distinct  # Get instrument list. Added .order for WebMock testing.
    trades = TradeCache::last_prices(instruments, params.key?('livePrices'))
    logger.info 'LAST PRICE LOAD END.'
    render json: trades, each_serializer: TradeSerializer
  end

  # Update last price data for every instrument in the database.
  # Intended for admin user only.
  def last_price_bulk_load
    logger.info 'LAST PRICE BULK LOAD REQUESTED.'
    FeedWorker.perform_async('last_price_bulk_load')
    head :accepted
  end
end
