Rails.application.routes.draw do
  scope '/api' do
    get '/trades/latestPrices', to: "trades#latest_prices"
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    resources :companies, only: [:index]
  end
end
