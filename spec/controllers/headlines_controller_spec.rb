require 'rails_helper'

RSpec.describe HeadlinesController, type: :controller do
  describe "GET index" do
    it "returns headlines" do
      request.accept = "application/json"
      get :index, format: :json
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr.length).to be > 0
      expect(pr['articles'][0]['author']).to eq('Shannon Pettypiece')
    end
  end
end
