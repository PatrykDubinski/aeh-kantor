Rails.application.routes.draw do
  mount Rswag::Api::Engine => '/api-docs'
  mount Rswag::Ui::Engine => '/api-docs'

  post "/auth/register", to: "auth#register"
  post "/auth/login", to: "auth#login"

  get "/rates", to: "rates#index"
  get "/rates/current/:currency", to: "rates#current"
  get "/rates/history/:currency/:days", to: "rates#history"

  get "/profile", to: "profile#show"
  post "/profile/top_up", to: "profile#top_up"

  get "/wallet", to: "wallets#index"

  resources :transactions, only: [:index, :create]
end
