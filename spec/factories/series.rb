FactoryBot.define do
  factory :series do
    instrument   {build(:instrument)}
    time_interval "MA"
    series_date   "2017-12-31"
    open_price    123.450
    high_price    133.450
    low_price     113.450
    close_price   128.450
    volume        112561
    dividend_amount 1.48
  end
end
