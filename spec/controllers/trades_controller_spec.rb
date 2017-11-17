require 'rails_helper'

RSpec.describe TradesController, type: :controller do
  describe "GET market index" do
    it "returns a market index" do
      request.accept = "application/json"
      get :last_index, { :params => { symbols: ['DJIA'] }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
  end

  describe "GET instrument prices" do
    it "returns database prices" do
      request.accept = "application/json"
      get :last_price, { :params => { userId: 1 }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
    it "returns data feed prices" do
      request.accept = "application/json"
      get :last_price, { :params => { userId: 1, livePrices: '' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
  end
end
