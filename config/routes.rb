Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :open_positions
  resources :daily_trades
  resources :stock_symbols
  resources :companies
  resources :positions
  resources :portfolios
  resources :users
  resources :companies, only: [:index]
  scope '/api' do
    get :food, to: 'companies#index'
    get :portfolios, to: 'portfolios#index'
  end
end
