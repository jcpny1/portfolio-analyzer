require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = build(:user, name: "John Doe")
  end

  it "has a name" do
    expect(@user.name).to eq('John Doe')
  end
end
