require 'rails_helper'

RSpec.describe HeadlinesController, type: :controller do
  describe "GET headlines" do
    it "returns headlines" do
      request.accept = "application/json"
      get :headlines, format: :json
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      # expect(pr.length).to be > 0
    end
  end
end
