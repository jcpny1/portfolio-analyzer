require 'rails_helper'

RSpec.describe StockSymbol, type: :model do
  before do
    @stock_symbol = build(:stock_symbol, name: "ABC")
  end

  it "has a name" do
    expect(@stock_symbol.name).to eq('ABC')
  end
end
