require 'rails_helper'

RSpec.describe Portfolio, type: :model do
  before do
    @portfolio = build(:portfolio, name: "Portfolio 1")
  end

  it "has a name" do
    expect(@portfolio.name).to eq('Portfolio 1')
  end
end
