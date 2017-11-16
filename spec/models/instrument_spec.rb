require 'rails_helper'

RSpec.describe Instrument, type: :model do
  before do
    @instrument = build(:instrument, name: "ABC")
  end

  it "has a symbol" do
    expect(@instrument.symbol).to eq('ABC')
  end
end
