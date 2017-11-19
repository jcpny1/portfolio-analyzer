class FeedWorker
  require 'controllers/concerns/investors_exchange'
  include Sidekiq::Worker
  # def perform(*args)
  def perform(name)
    case name
    when 'instrument_bulk_load'
      logger.info 'INSTRUMENT BULK LOAD BEGIN.'
      added   = 0
      errored = 0
      skipped = 0
      updated = 0
      feed_records = InvestorsExchange::IEX_symbology()   # Call feed handler to retrieve symbology.
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
    else
      "FeedWorker Error: invalid request (#{name})"
    end
  end
end
