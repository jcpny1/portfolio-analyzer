require 'rails_helper'

RSpec.describe Trade, type: :model do
  before do
    @stock_symbol = StockSymbol.create!(name: 'ABC', long_name: 'Acme Baking Company')
    @trade = Trade.create!(stock_symbol: @stock_symbol, trade_date: '2017-11-09', trade_price: 123.45, price_change: 1.125)
  end

  it "has a price change" do
    expect(@trade.price_change).to eq(1.125)
  end
end
