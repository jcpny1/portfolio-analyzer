require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = User.create!(name: 'John Doe', email: 'j.doe@aol.com', locale: 'en-US')
  end

  it "has a name" do
    expect(@user.name).to eq('John Doe')
  end
end
