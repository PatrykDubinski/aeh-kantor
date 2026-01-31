# spec/integration/rates_spec.rb
require 'swagger_helper'

RSpec.describe 'Exchange Rates', type: :request do
  path '/rates/latest' do
    get 'Get latest currency rates from NBP' do
      tags 'Rates'
      produces 'application/json'

      response '200', 'rates returned' do
        run_test!
      end
    end
  end

  path '/rates/history' do
    get 'Get historical currency rates' do
      tags 'Rates'
      produces 'application/json'

      parameter name: :currency, in: :query, type: :string
      parameter name: :start_date, in: :query, type: :string
      parameter name: :end_date, in: :query, type: :string

      response '200', 'history returned' do
        run_test!
      end
    end
  end
end
