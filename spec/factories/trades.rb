FactoryBot.define do
  factory :trade do
    instrument   {build(:instrument)}
    trade_date   "2017-12-08"
    trade_price  123.450
    price_change   1.125
  end
end
