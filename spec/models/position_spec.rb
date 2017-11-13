require 'rails_helper'

RSpec.describe Position, type: :model do
  before do
    @user = User.create!(name: 'John Doe', email: 'j.doe@aol.com', locale: 'en-US')
    @portfolio = @user.portfolios.create!(name: 'Portfolio 1')
    @stock_symbol = StockSymbol.create!(name: 'ABC', long_name: 'Acme Baking Company')
    @position = @portfolio.positions.create!(portfolio: @portfolio, stock_symbol: @stock_symbol, quantity: 100.0, cost: 1000.0, date_acquired: '05-06-2007')
  end

  it "has a name" do
    expect(@position.stock_symbol.name).to eq('ABC')
  end
end
