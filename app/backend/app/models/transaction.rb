class Transaction < ApplicationRecord
  belongs_to :user

  validates :direction, inclusion: { in: %w[buy sell] }
end
