require 'rails_helper'

RSpec.describe Position, type: :model do
  before do
    @position = build(:position)
  end

  it "has a symbol" do
    expect(@position.instrument.symbol).to eq('ABC')
  end
end
