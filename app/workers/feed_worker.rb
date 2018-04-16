# This class is responsible for executing feed-related SideKiq jobs.
class FeedWorker
  include Sidekiq::Worker
  # Perform the specified task (in a worker thread).
  # Parameters instrument_set and symbols are only used when name='series_bulk_load'.
  #   instrument_set = a string denoting which instruments to load ('active'|'all').
  #   symbols = a comma-delimited list of symbols (e.g., 'AA,BT,QQQ').
  def perform(name, instrument_set=nil, symbols=nil)
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
      if instrument_set == 'all'  # for all instruments
        instruments = Instrument.select(:symbol).order(:symbol)
      elsif instrument_set == 'active'  # or only for instruments held in Positions
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
