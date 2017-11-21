require 'rails_helper'

RSpec.describe PortfoliosController, type: :controller do
  before(:each) do
    @user = create(:user);
    @portfolio = create(:portfolio, user: @user)
  end

  describe "GET #index" do
    it "returns all portfolios" do
      request.accept = "application/json"
      get :index, format: :json
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['name']).to eq(@portfolio.name)
    end
  end

  describe "GET #show" do
    it "returns one portfolio" do
      request.accept = "application/json"
      get :show, { :params => { id: 1 }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr.length).to be > 0
      expect(pr[0]['name']).to eq('Portfolio 5')
    end
  end

  describe "POST #create" do
    it "creates a new portfolio" do
      request.accept = "application/json"
      post :create, { params: { portfolio: { user_id: @user.id, name: 'waTSon' }, format: :json }}
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr['name']).to eq('waTSon')
    end
  end

  describe "PATCH #update" do
    it "updates an existing portfolio" do
      request.accept = "application/json"
      patch :update, { params: { id: @portfolio.id, portfolio: { name: 'XYZee' }}, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr['name']).to eq('XYZee')
    end
  end

  describe "DELETE #destroy" do
    it "deletes an existing portfolio" do
      request.accept = "application/json"
      delete :destroy, { params: { id: @portfolio.id }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(pr['name']).to eq(@portfolio.name)
    end
  end
end
