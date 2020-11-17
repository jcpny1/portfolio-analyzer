require 'rails_helper'

RSpec.describe PortfoliosController, type: :controller do
  before(:each) do
    @user = create(:user)
    @portfolio = create(:portfolio, user: @user)
  end

  describe "GET #index" do
    it "returns all portfolios" do
      request.accept = "application/json"
      get :index, :format => :json
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['name']).to eq("Crazy 8's")
    end
  end

  describe "GET #show" do
    it "returns one portfolio" do
      request.accept = "application/json"
      get :show, { :params => { id: @portfolio.id }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data'][0]['attributes']['name']).to eq(@portfolio.name)
    end
  end

  describe "POST #create" do
    it "creates a new portfolio" do
      request.accept = "application/json"
      post :create, { params: { portfolio: { name: 'waTSon' }, format: :json }}
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data']['attributes']['name']).to eq('waTSon')
    end
  end

  describe "PATCH #update" do
    it "updates an existing portfolio" do
      request.accept = "application/json"
      patch :update, { params: { id: @portfolio.id, portfolio: { name: 'XYZee' }}, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data']['attributes']['name']).to eq('XYZee')
    end
  end

  describe "DELETE #destroy" do
    it "deletes an existing portfolio" do
      request.accept = "application/json"
      delete :destroy, { params: { id: @portfolio.id }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data']['attributes']['name']).to eq(@portfolio.name)
    end
  end
end
