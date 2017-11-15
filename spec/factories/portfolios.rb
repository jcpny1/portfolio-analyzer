FactoryBot.define do
  factory :portfolio do
    user {build(:user)}
    name "Portfolio X"
  end
end
