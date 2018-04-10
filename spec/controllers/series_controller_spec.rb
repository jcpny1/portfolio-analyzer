require 'rails_helper'

RSpec.describe SeriesController, type: :controller do
  describe "GET monthly series" do
    it "returns monthly series data" do
      request.accept = "application/json"
      get :monthly_series, { :params => { symbols: 'AAPL', start_date: '2017-01-01', end_date: '2018-01-01' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['adjusted-close-price']).to eq('128.45')
      expect(pr['included'].length).to be > 0
      expect(pr['included'][0]['attributes']['symbol']).to eq('AAPL')
    end
    it "bulk loads database series" do
      request.accept = "application/json"
      get :series_bulk_load
      expect(response).to have_http_status(:success)
    end
  end
end
