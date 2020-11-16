FactoryBot.define do
  factory :user do
    name   { "guest" }
    email  { "j.doe@aol.com" }
    locale { "en-US" }
  end
end
