FactoryBot.define do
  factory :wallet do
    user
    currency { "USD" }
    amount { 500 }
  end
end
