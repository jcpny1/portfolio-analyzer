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
      instrument_symbols = Instrument.select(:id, :symbol).order(:symbol)
      DataCache.price_values(instrument_symbols, true, true)
    when 'series_bulk_load'
      # Get latest series data points
      instrument_symbols = []
      pa_value = PaValue.find_by(name: 'series_bulk_load_symbol')
      if instrument_set == 'all'  # for all instruments
        instrument_symbols = Instrument.select(:symbol).where('symbol > ?', pa_value.value).order(:symbol)
      elsif instrument_set == 'active'  # or only for instruments held in Positions
        instrument_symbols = Instrument.select(:symbol).where(id: Position.select('instrument_id').distinct).where('symbol > ?', pa_value.value).order(:symbol)
      end
      symbol_array = instrument_symbols.map(&:symbol)
      symbol_array.concat(symbols.split(',')) unless symbols.nil?  # and add symbols, if specified.
      symbol_array.sort!
      symbol_array.uniq!
      DataCache.series_bulk_load(symbol_array, true)
      pa_value = PaValue.find_by(name: 'series_bulk_load_symbol')
      pa_value.value = ''  # clear restart value
      pa_value.save!
    else
      "FeedWorker Error: invalid request (#{name})"
    end
    nil
  end
end
