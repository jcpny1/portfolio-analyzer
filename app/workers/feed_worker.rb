class FeedWorker
  include Sidekiq::Worker

  # Perform the specified task (in a worker thread).
  def perform(name)
    case name

    when 'instrument_bulk_load'
      feed_records = Feed::IEX.symbology  # Call feed handler to retrieve symbology.
      InstrumentCache.bulk_load(feed_records)

    when 'last_price_bulk_load'
      logger.info 'LAST PRICE BULK LOAD BEGIN.'

      # # Store last price data for every instrument in the database.
      # # Intended for admin user only.
      # def last_price_bulk_load
      #   logger.info 'LAST PRICE BULK LOAD BEGIN.'
      #   instruments = Instrument.select(:id, :symbol)      # Get instrument list.
      #   trades = load_prices_from_database(instruments)    # Get database prices as a baseline.
      #   saved_ctr = 0
      #   Feed::load_prices(instruments) do |live_trades|  # Get feed prices.
      #     saved_ctr = save_trades(live_trades, trades)   # Update database prices with feed prices.
      #   end
      #   logger.info "LAST PRICE LOAD END (new prices saved: #{saved_ctr})."
      #   head :accepted
      # end

    else
      "FeedWorker Error: invalid request (#{name})"
    end
    nil
  end
end
