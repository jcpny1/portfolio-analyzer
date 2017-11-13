require 'rails_helper'

RSpec.describe StockSymbol, type: :model do
  before do
    @stock_symbol = StockSymbol.create!(name: 'ABC', long_name: 'Acme Baking Company')
  end

  it "has a name" do
    expect(@stock_symbol.name).to eq('ABC')
  end
end
