# This class is responsible for interfacing the outside world with the Series data store.
class SeriesCache
  # Update series cache for given symbols.
  def self.bulk_load(symbol_array)
    Rails.logger.debug 'SERIES BULK LOAD BEGIN.'
    processed = 0
    symbol_array.each_slice(DataCache::SERIES_BATCH_SIZE) do |symbol_batch|
      sleep DataCache::SERIES_BATCH_DELAY if processed.nonzero?  # Throttle request rate.
      processed += symbol_batch.length
      series_batch = series_from_database(symbol_batch, nil, nil)  # Get database series as a baseline.
      Feed.load_series(symbol_batch) do |live_series|  # Get feed series.
        save_series(live_series, series_batch)         # Update database series with feed series.
        clean_series(live_series, series_batch)        # Remove obsolete series data points.
      end
    end
    Rails.logger.debug "SERIES BULK LOAD END (received: #{symbol_array.length}, processed: #{processed})."
  end

  # Retrieve the latest values for the given symbols array.
  def self.series(symbols, start_date, end_date)
    series_from_database(symbols, start_date, end_date)
  end

  ### private ###

  # Remove obsolete data points.
  # Delete from database where series_batch record not in live_series.
  private_class_method def self.clean_series(live_series, series_batch)
    series_delete_array = []
    live_series.each do |ls_instrument|
      next if (ls_instrument.length.zero? || ls_instrument[0].time_interval.nil?)
      series_batch.each do |s_dp|
        ls_dp = ls_instrument.find { |dp| (dp.instrument_id == s_dp.instrument_id) && (dp.time_interval == s_dp.time_interval) && (dp.series_date == s_dp.series_date) }
        series_delete_array.push(s_dp.id) if ls_dp.nil?
      end
    end
    Series.destroy(series_delete_array)
    Rails.logger.debug "SERIES DESTROYED: #{series_delete_array.length}."
  end

  # Updates series with live_series data and saves to the database.
  # Reuse existing database records where possible.
  private_class_method def self.save_series(live_series, series)
    saved_series_ctr = 0
    Series.transaction do
      live_series.each do |ls_instrument|
        ls_instrument.each do |ls_dp|
          if ls_dp.time_interval.nil?
            Rails.logger.error "Missing series data point: #{ls_dp.inspect}."
            next
          end
          # For each live series instrument and date, find corresponding entry in series.
          s_dp = series.find { |dp| (dp.instrument_id == ls_dp.instrument_id) && (dp.time_interval == ls_dp.time_interval) && (dp.series_date == ls_dp.series_date) }
          # If s_dp is still null, then create a new record.
          s_dp = Series.new(instrument: ls_dp.instrument) if s_dp.nil?
          # If any values have changed, update s_dp.
          begin
            if Series.dataChanged?(s_dp, ls_dp)
              Series.dataUpdate(s_dp, ls_dp)
              saved_series_ctr += 1
            end
          rescue ActiveRecord::ActiveRecordError => e
            Rails.logger.error "Error saving series: #{s_dp.inspect}, #{e}."
          end
        end
      end
    end
    Rails.logger.debug "SERIES UPDATED  : #{saved_series_ctr}."
  end

  # Fetch database series by symbol.
  private_class_method def self.series_from_database(symbols, start_date, end_date)
    if start_date.nil?  # Retrieve all data points
      Series.joins(:instrument).where(instruments: { symbol: symbols }).distinct.order('instrument_id, time_interval, series_date').preload(:instrument)
    else  # Retrieve data points within date range.
      Series.joins(:instrument).where(instruments: { symbol: symbols }).where("series_date between ? and ?", start_date, end_date).distinct.order('instrument_id, time_interval, series_date').preload(:instrument)
    end
  end

# Client.where("created_at >= :start_date AND created_at <= :end_date", {start_date: params[:start_date], end_date: params[:end_date]})
# Client.where(created_at: (Time.now.midnight - 1.day)..Time.now.midnight)

end
