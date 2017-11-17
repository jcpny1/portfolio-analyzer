require 'rails_helper'

RSpec.describe InstrumentsController, type: :controller do
  describe "GET index" do
    it "returns an instrument" do
      request.accept = "application/json"
      get :index, :format => :json, :params => { v: 'INTC' }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
    end
  end
end
