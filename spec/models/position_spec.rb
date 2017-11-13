require 'rails_helper'

RSpec.describe Position, type: :model do
  before do
    @position = build(:position)
  end

  it "has a name" do
    expect(@position.stock_symbol.name).to eq('ABC')
  end
end
