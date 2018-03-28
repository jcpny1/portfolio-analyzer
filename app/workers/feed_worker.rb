# This class is responsible for executing feed-related SideKiq jobs.
class FeedWorker
  include Sidekiq::Worker
  # Perform the specified task (in a worker thread).
  def perform(name)
    case name
    when 'instrument_bulk_load'
      # Get latest list of instruments.
      feed_records = Feed.symbology  # Call feed handler to retrieve symbology.
      DataCache.instrument_bulk_load(feed_records)
    when 'price_bulk_load'
      # Get latest prices for all instruments.
      instruments = Instrument.select(:id, :symbol).order(:symbol)
      DataCache.price_values(instruments, true)
    when 'series_bulk_load_all'
      # Get series data for all instruments.
      instruments = Instrument.select(:id, :symbol).order(:symbol)
      DataCache.series_bulk_load(instruments)
    when 'series_bulk_load_new'
      # Get series data for instruments not yet in Series table.
      instruments = Instrument.select(:id, :symbol).where.not(id: Series.select('instrument_id').distinct).order(:symbol)
      DataCache.series_bulk_load(instruments)
    else
      "FeedWorker Error: invalid request (#{name})"
    end
    nil
  end
end
