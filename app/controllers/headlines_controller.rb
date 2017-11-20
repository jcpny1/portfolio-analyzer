# This controller handles requests for headline news.
class HeadlinesController < ApplicationController
  # Retrieve all general headlines.
  def headlines
    render json: Feed::NewsAPI.headlines
  end
end
