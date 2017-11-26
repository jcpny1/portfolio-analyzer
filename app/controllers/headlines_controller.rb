# This controller handles requests for headline news.
class HeadlinesController < ApplicationController
  # Retrieve news headlines.
  def index
    render json: Feed.headlines
  end
end
