FactoryBot.define do
  factory :portfolio do
    user {build(:user)}
    name " <do-not-use>"
  end
end
