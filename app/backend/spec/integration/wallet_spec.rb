# spec/integration/wallet_spec.rb
require 'swagger_helper'

RSpec.describe 'Wallet', type: :request do
  path '/wallet' do
    get 'Get wallet balance' do
      tags 'Wallet'
      produces 'application/json'

      response '200', 'wallet returned' do
        run_test!
      end
    end
  end
end
