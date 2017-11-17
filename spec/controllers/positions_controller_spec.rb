require 'rails_helper'

RSpec.describe PositionsController, type: :controller do
  before(:each) do
    @user = create(:user);
    @portfolio = create(:portfolio, user: @user)
    @instrument = create(:instrument)
  end

  describe "POST new" do
    it "creates a new position" do
      request.accept = "application/json"
      post :create, { params: { portfolio_id: @portfolio.id, position: { instrument_id: @instrument.id, quantity:100, cost: 200, date_acquired: '2011-11-11' }}, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      # expect(pr[0]['name']).to eq(@portfolio.name)
    end
  end



end
