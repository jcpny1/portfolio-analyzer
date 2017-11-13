require 'rails_helper'

RSpec.describe Portfolio, type: :model do
  before do
    @user = User.create!(name: 'John Doe', email: 'j.doe@aol.com', locale: 'en-US')
    @portfolio = @user.portfolios.create!(name: 'Portfolio 1')
  end

  it "has a name" do
    expect(@portfolio.name).to eq('Portfolio 1')
  end
end
