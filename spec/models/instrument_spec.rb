require 'rails_helper'

RSpec.describe Instrument, type: :model do
  before do
    @instrument = build(:instrument, symbol: "ABC")
  end

  it "has a symbol" do
    expect(@instrument.symbol).to eq('ABC')
  end
end
