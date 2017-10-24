Rails.application.routes.draw do
  scope '/api' do
    get '/daily_trades/lastPrices', to: "daily_trades#last_prices"
    resources :portfolios do
      resources :open_positions, only: [:create, :update, :destroy]
    end
    resources :stock_symbols, only: [:index]
  end
end
