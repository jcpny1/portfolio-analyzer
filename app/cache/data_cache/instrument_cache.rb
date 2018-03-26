# This class is responsible for interfacing the outside world with the Instrument data store.
class InstrumentCache
  # Update instrument cache from instrument_data records.
  # instrument_data: [{symbol name},...]
  def self.bulk_load(instrument_data)
    Rails.logger.debug 'INSTRUMENT BULK LOAD BEGIN.'
    added   = 0
    errored = 0
    skipped = 0
    updated = 0
    Instrument.transaction do
      instrument_data.each do |instrument_record|
        begin
          instrument = Instrument.where('symbol = ?', instrument_record['symbol']).first
          if instrument.nil?
            Instrument.create!(symbol: instrument_record['symbol'], name: instrument_record['name'])
            added += 1
          elsif !instrument_record['name'].casecmp?(instrument.name)
            instrument.update!(name: instrument_record['name'])
            updated += 1
          else
            skipped += 1
          end
        rescue ActiveRecord::ActiveRecordError => e
          Rails.logger.error "INSTRUMENT REFRESH: Error saving symbol: #{symbol_record.inspect}, #{e}."
          errored += 1
        end
      end
    end
    Rails.logger.debug "INSTRUMENT BULK LOAD END (received: #{instrument_data.length}, added: #{added}, updated: #{updated}, skipped: #{skipped}, errors: #{errored})."
  end
end
