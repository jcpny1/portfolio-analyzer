require 'rails_helper'

RSpec.describe ApplicationRecord, type: :model do
  it "has an abstract class attribute" do
    expect(ApplicationRecord.abstract_class).to eq(true)
  end
end
