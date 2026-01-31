class ExchangeRate < ApplicationRecord
  validates :currency, presence: true
  validates :rate, presence: true, numericality: { greater_than: 0 }
  validates :date, presence: true, uniqueness: { scope: :currency }
end
