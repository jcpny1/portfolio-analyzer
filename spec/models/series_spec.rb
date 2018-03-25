require 'rails_helper'

RSpec.describe Series, type: :model do
  before do
    @series_point_1 = build(:series, close_price: 128.450)
    @series_point_2 = build(:series, close_price: 128.550)
  end

  it "has a close_price change" do
    expect(@series_point_1.changed?(@series_point_2)).to eq(true)
  end
end
