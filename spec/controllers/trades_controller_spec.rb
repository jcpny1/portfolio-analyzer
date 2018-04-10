require 'rails_helper'

RSpec.describe TradesController, type: :controller do
  describe "GET market index" do
    it "returns a market index" do
      request.accept = "application/json"
      get :last_index, { :params => { symbols: 'DJIA' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['instrument']['symbol']).to eq('DJIA')
      expect(pr['data'][0]['attributes']['trade-price']).to eq('24686.0898')
      expect(pr['data'][0]['attributes']['price-change']).to eq('-260.42')
    end
  end

  describe "GET instrument prices" do
    it "returns database prices" do
      request.accept = "application/json"
      get :last_price, { :params => { userId: 1 }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['instrument-id']).to eq(1)
      expect(pr['data'][0]['attributes']['trade-price']).to eq('171.5')
    end
    it "returns data feed prices" do
      request.accept = "application/json"
      get :last_price, { :params => { userId: 1, livePrices: '' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to eq(12)
      expect(pr['data'][0]['attributes']['instrument-id']).to eq(1)
      expect(pr['data'][0]['attributes']['trade-price']).to eq('175.42')
    end
    it "bulk loads database prices" do
      request.accept = "application/json"
      get :price_bulk_load
      expect(response).to be_successful
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
