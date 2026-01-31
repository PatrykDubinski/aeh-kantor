FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { "password123" }
    balance { 1000.00 }
  end
end
