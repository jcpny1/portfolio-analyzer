# This class is responsible for interfacing the outside world with the Series data store.
class SeriesCache
  # Retrieve the latest values for the given symbols array.
  def self.series(symbols)
    series = []
    symbols.each_slice(DataCache::FEED_BATCH_SIZE) do |symbol_batch|
      sleep DataCache::FEED_BATCH_DELAY if series.length.nonzero?   # Throttle request rate after first request.
      series_batch = Feed.load_series(symbol_batch)
      series.concat(series_batch)
    end
    series
  end
end
