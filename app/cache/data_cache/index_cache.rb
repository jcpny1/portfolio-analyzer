# This class is responsible for interfacing the outside world with the Trade data store.
class IndexCache
  # Retrieve the latest values for the given index array.
  def self.indexes(symbols)
    indexes = []
    symbols.each_slice(DataCache::INDEX_BATCH_SIZE) do |symbol_batch|
      sleep DataCache::INDEX_BATCH_DELAY if indexes.length.nonzero?  # Throttle request rate after first request.
      index_batch = Feed.load_indexes(symbol_batch)
      indexes.concat(index_batch)
    end
    indexes
  end
end
