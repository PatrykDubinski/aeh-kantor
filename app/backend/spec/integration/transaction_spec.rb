# spec/integration/transactions_spec.rb
require 'swagger_helper'

RSpec.describe 'Transactions', type: :request do
  path '/transactions' do
    get 'List user transactions' do
      tags 'Transactions'
      produces 'application/json'

      response '200', 'transactions list' do
        run_test!
      end
    end

    post 'Create a buy/sell transaction' do
      tags 'Transactions'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :transaction, in: :body, schema: {
        type: :object,
        properties: {
          currency: { type: :string },
          amount: { type: :number },
          operation: { type: :string, enum: %w[BUY SELL] }
        },
        required: %w[currency amount operation]
      }

      response '201', 'created' do
        let(:transaction) { { currency: 'USD', amount: 100, operation: 'BUY' } }
        run_test!
      end

      response '422', 'error' do
        let(:transaction) { { amount: 10 } }
        run_test!
      end
    end
  end
end
