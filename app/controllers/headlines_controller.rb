# This controller handles requests for headline news.
class HeadlinesController < ApplicationController
  # Retrieve all general headlines.
  def headlines
    newsapi_handler = Adapter::NewsAPI.new
    render json: newsapi_handler.headlines
  end
end
