require 'rails_helper'

RSpec.describe SeriesController, type: :controller do
  before(:each) do
    @series = create(:series)
  end

  describe "GET monthly series" do
    it "returns monthly series data" do
      request.accept = "application/json"
      get :monthly_series, { :params => { symbols: @series.instrument.symbol, start_date: '2017-01-01', end_date: '2018-01-01' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['adjusted-close-price']).to eq(@series.adjusted_close_price.to_s)
      expect(pr['included'].length).to be > 0
      expect(pr['included'][0]['attributes']['symbol']).to eq(@series.instrument.symbol)
    end

    it "bulk loads database series" do
      @instrument = create(:instrument, symbol: 'NEWT')
      request.accept = "application/json"
      get :series_bulk_load, { :params => { instruments: 'all' } }
      expect(response).to be_successful
    end
  end

  describe "Run async worker" do
    it "populates database with all prices" do
      Sidekiq::Testing.inline! do
        FeedWorker.perform_async('series_bulk_load', 'all', nil)  # Update all instruments' series.
      end
    end
  end
end
