# spec/integration/auth_spec.rb
require 'swagger_helper'

RSpec.describe 'Authentication API', type: :request do
  path '/auth/register' do
    post 'Register a new user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string }
        },
        required: %w[email password]
      }

      response '201', 'user created' do
        let(:user) { { email: 'test@example.com', password: 'password123' } }
        run_test!
      end

      response '422', 'validation error' do
        let(:user) { { email: '' } }
        run_test!
      end
    end
  end

  path '/auth/login' do
    post 'Login user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string }
        },
        required: %w[email password]
      }

      response '200', 'successful login' do
        let(:credentials) { { email: 'test@example.com', password: 'password123' } }
        run_test!
      end

      response '401', 'unauthorized' do
        let(:credentials) { { email: 'test@example.com', password: 'wrong' } }
        run_test!
      end
    end
  end
end
