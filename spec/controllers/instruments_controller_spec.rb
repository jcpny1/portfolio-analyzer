require 'rails_helper'

RSpec.describe InstrumentsController, type: :controller do
  describe "GET index" do
    it "returns an instrument" do
      request.accept = "application/json"
      get :index, { :params => { v: 'INTC' }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['name']).to eq('Intel Corp')
    end
  end

  describe "GET symbology" do
    it "populates database with all instruments" do
      request.accept = "application/json"
      get :refresh_from_feed, :format => :json
      expect(response).to have_http_status(:success)
    end
  end
end
