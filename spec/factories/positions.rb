FactoryBot.define do
  factory :position do
    portfolio     {build(:portfolio)}
    instrument    {build(:instrument)}
    quantity       100
    cost          1000
    date_acquired '2013-12-11'
  end
end
