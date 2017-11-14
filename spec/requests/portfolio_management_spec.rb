require "rails_helper"

RSpec.describe "Portfolio Management", :type => :request do
  before do
    @user = create(:user, name: "User X")
  end

  it "creates a Portfolio" do
    headers = {
      "ACCEPT" => "application/json",
    }
    post "/api/portfolios", :params => { :portfolio => {:user_id => @user.id, :name => "Portfolio 1"} }, :headers => headers

    expect(response.content_type).to eq("application/json")
    expect(response).to have_http_status(:created)
  end

end
