# This controller handles requests for headline news.
class HeadlinesController < ApplicationController
  # Retrieve news headlines.
  def headlines
    render json: Feed.headlines
  end
end
