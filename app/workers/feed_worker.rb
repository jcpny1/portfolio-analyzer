class FeedWorker
  include Sidekiq::Worker
  # Perform the specified task (in a worker thread).
  def perform(name)
    case name
    when 'instrument_bulk_load'
      feed_records = Feed.symbology  # Call feed handler to retrieve symbology.
      DataCache.instrument_bulk_load(feed_records)
    when 'price_bulk_load'
      instruments = Instrument.select(:id, :symbol)  # Get instrument list.
      DataCache.price_values(instruments, true)
    else
      "FeedWorker Error: invalid request (#{name})"
    end
    nil
  end
end
