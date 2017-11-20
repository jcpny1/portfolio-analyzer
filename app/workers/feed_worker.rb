class FeedWorker
  include Sidekiq::Worker

  # Perform the specified task.
  # def perform(*args)
  def perform(name)
    case name

    when 'instrument_bulk_load'
      logger.info 'INSTRUMENT BULK LOAD BEGIN.'
      added   = 0
      errored = 0
      skipped = 0
      updated = 0
      feed_records = Feed::IEX.symbology  # Call feed handler to retrieve symbology.
      Instrument.transaction do
        feed_records.each do |feed_record|
          begin
            instrument = Instrument.where('symbol = ?', feed_record['symbol']).first
            if instrument.nil?
              Instrument.create!(symbol: feed_record['symbol'], name: feed_record['name'])
              added += 1
            elsif !feed_record['name'].casecmp?(instrument.name)
              instrument.update!(name: feed_record['name'])
              updated += 1
            else
              skipped += 1
            end
          rescue ActiveRecord::ActiveRecordError => e
            logger.error "INSTRUMENT REFRESH: Error saving stock symbol: #{symbol_record.inspect}, #{e}"
            errored += 1
          end
        end
      end
      logger.info "INSTRUMENT BULK LOAD END (received: #{feed_records.length}, added: #{added}, updated: #{updated}, skipped: #{skipped}, errors: #{errored})."
    when 'price_bulk_load'
      logger.info 'PRICE BULK LOAD BEGIN.'

    else
      "FeedWorker Error: invalid request (#{name})"
    end
    nil
  end
end
