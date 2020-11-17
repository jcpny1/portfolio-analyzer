require 'rails_helper'

RSpec.describe Trade, type: :model do
  before do
    @trade = build(:trade, price_change: 1.125)
  end

  it "has a price change" do
    expect(@trade.price_change).to eq(1.125)
  end
end
