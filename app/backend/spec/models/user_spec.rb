require 'rails_helper'

RSpec.describe User, type: :model do
  it "has valid factory" do
    expect(build(:user)).to be_valid
  end

  it "requires email" do
    user = build(:user, email: nil)
    expect(user).not_to be_valid
  end

  it "hashes password" do
    user = create(:user, password: "secret")
    expect(user.password_digest).to be_present
  end
end
