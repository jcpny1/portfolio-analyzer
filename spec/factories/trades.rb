FactoryBot.define do
  factory :trade do
    stock_symbol {build(:stock_symbol)}
    trade_date  "2017-11-09"
    trade_price  123.45
    price_change   1.125
  end
end
