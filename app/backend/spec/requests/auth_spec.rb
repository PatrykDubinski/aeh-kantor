require 'rails_helper'

RSpec.describe "Auth", type: :request do
  describe "POST /register" do
    it "registers new user" do
      post "/register", params: { email: "test@mail.com", password: "123123" }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["token"]).to be_present
    end
  end

  describe "POST /login" do
    let!(:user) { create(:user, password: "123123") }

    it "logs user in" do
      post "/login", params: { email: user.email, password: "123123" }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["token"]).to be_present
    end
  end
end
