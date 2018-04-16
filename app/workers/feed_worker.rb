# This class is responsible for executing feed-related SideKiq jobs.
class FeedWorker
  include Sidekiq::Worker
  # Perform the specified task (in a worker thread).
  # Parameters series and symbols are only used when name='series_bulk_load'.
  def perform(name, series=nil, symbols=nil)
    case name
    when 'instrument_bulk_load'
      # Get latest list of instruments.
      feed_records = Feed.symbology  # Call feed handler to retrieve symbology.
      DataCache.instrument_bulk_load(feed_records)
    when 'price_bulk_load'
      # Get latest prices for all instruments.
      instruments = Instrument.select(:id, :symbol).order(:symbol)
      DataCache.price_values(instruments, true)
    when 'series_bulk_load'
      # Get latest series data points
      instruments = []
      if series == 'all'  # for all instruments
        instruments = Instrument.select(:symbol).order(:symbol)
      elsif series == 'active'  # or only for instruments held in Positions
        instruments = Instrument.select(:symbol).where(id: Position.select('instrument_id').distinct).order(:symbol)
      end
      symbol_array = instruments.map(&:symbol)
      symbol_array.concat(symbols.split(',')) unless symbols.nil?  # and add symbols, if specified.
      symbol_array.sort!
      symbol_array.uniq!
      DataCache.series_bulk_load(symbol_array)
    else
      "FeedWorker Error: invalid request (#{name})"
    end
    nil
  end
end
