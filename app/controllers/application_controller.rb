class ApplicationController < ActionController::API

  # Retrieve all general headlines.
  def headlines
    api_key = ENV['NEWSAPI_API_KEY']
    response = {}
    begin
      conn = Faraday.new(url: 'https://newsapi.org/v1/articles')
    rescue Faraday::ClientError => e  # Can't connect.
      logger.error 'NEWSAPI FETCH ERROR.'
      errorMsg = "Faraday client error: #{e}"
    end

    begin
      logger.debug "NEWSAPI FETCH BEGIN."
      resp = conn.get do |req|
        req.params['source'] = 'bloomberg'
        req.params['sortBy'] = 'top'
        req.params['apikey'] = api_key
      end
      logger.debug "NEWSAPI FETCH END."
      response = JSON.parse(resp.body)
    rescue Faraday::ClientError => e  # Can't connect.
      logger.error "NEWSAPI FETCH ERROR: Faraday client error: #{e}."
    rescue JSON::ParserError => e  # JSON.parse error
      logger.error "NEWSAPI FETCH ERROR: JSON parse error: #{e}."
    end
    render json: response
  end
end
