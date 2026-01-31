require 'rails_helper'

RSpec.describe Wallet, type: :model do
  it "is valid" do
    expect(build(:wallet)).to be_valid
  end

  it "requires amount >= 0" do
    wallet = build(:wallet, amount: -5)
    expect(wallet).not_to be_valid
  end
end
