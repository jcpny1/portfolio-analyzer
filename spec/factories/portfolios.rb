FactoryBot.define do
  factory :portfolio do
    user {build(:user)}
    name { "Crazy 8's" }
  end
end
