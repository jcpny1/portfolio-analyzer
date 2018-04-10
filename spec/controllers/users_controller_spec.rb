require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  # before(:each) do
  #   @user = create(:user)
  # end

  # TODO: These tests will need to be fixed when user is no longer hardcoded to 1,'guest'.

  describe "GET #show" do
    it "returns one user" do
      request.accept = "application/json"
      get :show, { :params => { id: 1 }, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data'].length).to be > 0
      expect(pr['data']['id']).to eq('1')
    end
  end

  describe "PATCH #update" do
    it "updates an existing user" do
      request.accept = "application/json"
      patch :update, { params: { id: 1, user: { locale: 'krypton-en' }}, format: :json }
      pr = JSON.parse(response.body)
      expect(response).to be_successful
      expect(pr['data']['attributes']['locale']).to eq('krypton-en')
    end
  end
end
