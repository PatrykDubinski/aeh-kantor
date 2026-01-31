FactoryBot.define do
  factory :transaction do
    user
    currency { "USD" }
    rate { 4.1234 }
    amount { 100 }
    direction { "buy" }
  end
end
