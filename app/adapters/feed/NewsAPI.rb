module Feed
  # This controller handles requests for headline news.
  class NewsAPI
    # Retrieve all general headlines.
    def self.headlines
      api_key = ENV['RAILS_ENV'] == 'test' ? nil : ENV['NEWSAPI_API_KEY']
      response = {}
      begin
        conn = Faraday.new(url: 'https://newsapi.org/v1/articles')
      rescue Faraday::ClientError => e  # Can't connect.
        Rails.logger.error "NEWSAPI FETCH ERROR: Faraday client error: #{e}."
      end
      begin
        Rails.logger.debug 'NEWSAPI FETCH BEGIN.'
        resp = conn.get do |req|
          req.params['source'] = 'bloomberg'
          req.params['sortBy'] = 'top'
          req.params['apikey'] = api_key
        end
        Rails.logger.debug 'NEWSAPI FETCH END.'
        response = JSON.parse(resp.body)
      rescue Faraday::ClientError => e  # Can't connect.
        Rails.logger.error "NEWSAPI FETCH ERROR: Faraday client error: #{e}."
      rescue JSON::ParserError => e  # JSON.parse error
        Rails.logger.error "NEWSAPI FETCH ERROR: JSON parse error: #{e}."
      end
      response
    end
  end
end
