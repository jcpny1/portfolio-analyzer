# Rails controller for Company model.
class CompaniesController < ApplicationController
  # Retrieve all companies.
  def index
    q = params[:q]

    if q.blank?
      render json: {error: 'Expected parameter `q` '}, status: :bad_request
    else
      render json: Company.where(["name LIKE ?", "%#{q}%"]).limit(100)
    end
  end
end
