require 'rails_helper'

RSpec.describe PositionsController, type: :controller do
  before(:each) do
    @user = create(:user);
    @portfolio = create(:portfolio, user: @user)
    @instrument = create(:instrument)
  end

  describe "POST #create" do
    it "creates a new position" do
      request.accept = "application/json"
      post :create, { params: { portfolio_id: @portfolio.id, position: { instrument_id: @instrument.id, quantity:100, cost: 200, date_acquired: '2011-11-11' }}, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr['positions'][0]['instrument']['symbol']).to eq(@instrument.symbol)
    end
  end

  describe "PATCH #update" do
    it "updates an existing position" do
      request.accept = "application/json"
      @position = create(:position, portfolio: @portfolio, instrument: @instrument)
      patch :update, { params: { id: @position.id, portfolio_id: @portfolio.id, instrument_symbol: @position.instrument.symbol, position: { instrument_id: @instrument.id, quantity:200, cost: 200, date_acquired: '2011-11-11' }}, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr['positions'][0]['instrument']['symbol']).to eq(@instrument.symbol)
    end
  end

  describe "DELETE #destroy" do
    it "deletes an existing position" do
      request.accept = "application/json"
      @position = create(:position, portfolio: @portfolio, instrument: @instrument)
      delete :destroy, { params: { id: @position.id, portfolio_id: @portfolio.id }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr['name']).to eq(@portfolio.name)
    end
  end
end
