Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  scope '/api' do
    resources :portfolios do
      resources :open_positions
    end
    resources :stock_symbols, only: [:index]
    get '/daily_trades/last_close', to: "daily_trades#last_close"
  end
end
