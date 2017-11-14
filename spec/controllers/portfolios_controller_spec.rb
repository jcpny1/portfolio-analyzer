require 'rails_helper'

RSpec.describe PortfoliosController, type: :controller do
  before do
    @portfolio = create(:portfolio, name: "Portfolio 1")
  end

  describe "GET index" do
    it "returns all portfolios" do
      request.accept = "application/json"
      get :index, :format => :json
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['name']).to eq("Portfolio 1")
    end
  end

end
