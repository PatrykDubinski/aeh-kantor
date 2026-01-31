require 'rails_helper'

RSpec.describe "Transactions API", type: :request do
  let!(:user) { create(:user, balance: 2000) }
  let!(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  before do
    allow(NbpService).to receive(:current_rate).and_return(4.00)
  end

  it "creates BUY transaction" do
    post "/transactions",
         params: { currency: "USD", amount: 100, direction: "buy" },
         headers: headers

    expect(response).to have_http_status(:created)
    expect(user.transactions.count).to eq(1)
  end

  it "prevents buy if balance too low" do
    post "/transactions",
         params: { currency: "USD", amount: 10000, direction: "buy" },
         headers: headers

    expect(response).to have_http_status(400)
  end
end
