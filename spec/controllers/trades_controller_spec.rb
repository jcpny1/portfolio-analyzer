require 'rails_helper'

RSpec.describe TradesController, type: :controller do
  describe "GET market index" do
    it "returns a market index" do
      request.accept = "application/json"
      get :last_index, :format => :json, :params => { symbols: ['DJIA'] }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
  end

  describe "GET instrument prices" do
    it "returns database prices" do
      request.accept = "application/json"
      get :last_price, :format => :json, :params => { userId: 1 }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
    it "returns data feed prices" do
      request.accept = "application/json"
      get :last_price, :format => :json, :params => { userId: 1, livePrices: '' }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
  end
end
