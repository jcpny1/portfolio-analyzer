require 'rails_helper'

RSpec.describe Series, type: :model do
  before do
    @series_point_1 = build(:series, adjusted_close_price: 128.450)
    @series_point_2 = build(:series, adjusted_close_price: 128.550)
  end

  it "has a close_price change" do
    expect(Series.dataChanged?(@series_point_1, @series_point_2)).to eq(true)
  end

  it "has can be updated" do
    Series.dataUpdate(@series_point_1, @series_point_2)
    expect(@series_point_1.adjusted_close_price).to eq(@series_point_2.adjusted_close_price)
  end
end
