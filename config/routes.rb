Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  scope '/api' do
    get '/headlines',             to: 'headlines#index'
    get '/last-index',            to: 'trades#last_index'
    get '/monthly-series',        to: 'series#monthly_series'
    get '/portfolios/last-price', to: 'trades#last_price'
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    resources :instruments, only: [:index]
    resources :users, only: [:show, :update]
    get '/instruments/refresh', to: 'instruments#instrument_bulk_load'
    get '/series/refresh',      to: 'series#series_bulk_load'
    get '/trades/refresh',      to: 'trades#price_bulk_load'
  end
end
