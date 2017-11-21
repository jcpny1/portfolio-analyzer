require 'rails_helper'

RSpec.describe TradesController, type: :controller do
  describe "GET market index" do
    it "returns a market index" do
      request.accept = "application/json"
      get :last_index, { :params => { symbols: ['DJIA'] }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['instrument']['symbol']).to eq('["DJIA"]')
      expect(pr[0]['trade_price']).to eq('23358.24')
      expect(pr[0]['price_change']).to eq('-100.12')
    end
  end

  describe "GET instrument prices" do
    it "returns database prices" do
      request.accept = "application/json"
      get :last_price, { :params => { userId: 1 }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['instrument_id']).to eq(1)
      expect(pr[0]['trade_price']).to eq('171.5')
    end
    it "returns data feed prices" do
      request.accept = "application/json"
      get :last_price, { :params => { userId: 1, livePrices: '' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['instrument_id']).to eq(1)
      expect(pr[0]['trade_price']).to eq('170.15')
    end
    it "bulk loads database prices" do
      request.accept = "application/json"
      get :price_bulk_load
      expect(response).to have_http_status(:success)
    end
  end

  describe "Run async worker" do
    it "populates database with all prices" do
      Sidekiq::Testing.inline! do
        FeedWorker.perform_async('price_bulk_load')
      end
    end
  end
end
