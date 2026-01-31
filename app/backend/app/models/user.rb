class User < ApplicationRecord
  has_secure_password

  has_many :wallets
  has_many :transactions

  validates :email, presence: true, uniqueness: true
  validates :base_currency, presence: true
end
