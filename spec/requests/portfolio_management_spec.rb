require "rails_helper"

RSpec.describe "Portfolio Management", :type => :request do
  before(:each) do
    @user = create(:user);
    @portfolio = build(:portfolio, user: @user)
  end

  it "creates a Portfolio" do
    headers = {"ACCEPT" => "application/json"}
    post "/api/portfolios", :params => {portfolio: {user_id: @portfolio.user.id, name: @portfolio.name}}, :headers => headers
    expect(response.content_type).to eq("application/json")
    expect(response).to have_http_status(:created)
    @new_portfolio = JSON.parse(response.body)
    expect(@new_portfolio['name']).to eq(@portfolio.name)
  end

  it "destroys a Portfolio" do
    @portfolio.save
    delete "/api/portfolios/#{@portfolio.id}"
    expect(response).to have_http_status(:success)
  end

end
