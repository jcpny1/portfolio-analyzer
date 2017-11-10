Rails.application.routes.draw do
  scope '/api' do
    get '/portfolios/lastPrice', to: 'trades#last_price'
    get '/lastIndex',            to: 'trades#last_index'
    get '/headlines',            to: 'application#headlines'
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    resources :stock_symbols, only: [:index]
    get '/stock_symbols/refresh', to: 'stock_symbols#refresh_from_feed'
    get '/trades/refresh',        to: 'trades#last_price_bulk_load'
  end
end
