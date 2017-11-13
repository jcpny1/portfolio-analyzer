FactoryBot.define do
  factory :portfolio do
    user {build(:user)}
    name "Portfolio 1"
  end
end
