Rails.application.routes.draw do
  scope '/api' do
    get '/daily_trades/latestPrices', to: "daily_trades#latest_prices"
    resources :portfolios do
      resources :open_positions, only: [:create, :update, :destroy]
    end
    resources :companies, only: [:index]
  end
end
