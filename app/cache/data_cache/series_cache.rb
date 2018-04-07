# This class is responsible for interfacing the outside world with the Series data store.
class SeriesCache
  # Update series cache for given instruments.
  def self.bulk_load(instruments)
    Rails.logger.debug 'SERIES BULK LOAD BEGIN.'
    processed = 0
    instruments.each_slice(DataCache::SERIES_BATCH_SIZE) do |instrument_batch|
      sleep DataCache::SERIES_BATCH_DELAY if processed.nonzero?  # Throttle request rate.
      processed += instrument_batch.length
      symbols = instrument_batch.map(&:symbol)
      series_batch = series_from_database(symbols)  # Get database series as a baseline.
      Feed.load_series(symbols) do |live_series|    # Get feed series.
        save_series(live_series, series_batch)      # Update database series with feed series.
      end
    end
    Rails.logger.debug "SERIES BULK LOAD END (received: #{instruments.length}, processed: #{processed})."
  end

  # Retrieve the latest values for the given symbols array.
  def self.series(symbols)
    series_from_database(symbols)
  end

  ### private ###

  # Updates series with live_series data and saves to the database.
  private_class_method def self.save_series(live_series, series)
    saved_series_ctr = 0
    Series.transaction do
      live_series.each do |ls_instrument|
        ls_instrument.each do |lse|
          break if lse.nil?  # nil element is result of oldest year cutoff mapping in feed handler.
          if lse.time_interval.nil?
            Rails.logger.error "Missing series data point: #{lse.inspect}."
            next
          end
          # For each live series instrument and date, find corresponding entry in series.
          se = series.find { |dp| (dp.instrument_id == lse.instrument_id) && (dp.time_interval == lse.time_interval) && (dp.series_date == lse.series_date) }
          # If se is null, do we have an se with the same year and month?
          # If so, reuse that se record for the update.
          if se.nil?
            lse_series_date = lse.series_date.to_time.to_datetime
            lse_year = lse_series_date.year
            lse_month = lse_series_date.month
            se = series.find do |dp|
              dp_date = dp.series_date.to_time.to_datetime
              (dp.instrument_id == lse.instrument_id) && (dp.time_interval == lse.time_interval) && (dp_date.year == lse_year) && (dp_date.month == lse_month)
            end
          end
          # If se is still null, then create a new record.
          se = Series.new(instrument: lse.instrument) if se.nil?
          # If any values have changed, update se.
          begin
            if Series.dataChanged?(se, lse)
              Series.dataUpdate(se, lse)
              saved_series_ctr += 1
            end
          rescue ActiveRecord::ActiveRecordError => e
            Rails.logger.error "Error saving series: #{se.inspect}, #{e}."
          end
        end
      end
    end
    Rails.logger.debug "SERIES UPDATED: #{saved_series_ctr}."
  end

  # Fetch database series by symbol.
  private_class_method def self.series_from_database(symbols)
    Series.joins(:instrument).where(instruments: { symbol: symbols }).distinct.order('instrument_id, time_interval, series_date').preload(:instrument)
  end
end
