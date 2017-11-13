FactoryBot.define do
  factory :position do
    portfolio     {build(:portfolio)}
    stock_symbol  {build(:stock_symbol)}
    quantity      100
    cost          1000
    date_acquired '2013-12-11'
  end
end
