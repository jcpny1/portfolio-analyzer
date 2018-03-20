require 'rails_helper'

RSpec.describe SeriesController, type: :controller do
  describe "GET monthly series" do
    it "returns monthly series data" do
      request.accept = "application/json"
      get :monthly_series, { :params => { symbols: 'AAPL' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['adjusted-close-price']).to eq('128.45')
      expect(pr['included'].length).to be > 0
      expect(pr['included'][0]['attributes']['symbol']).to eq('AAPL')
    end
  end
end
