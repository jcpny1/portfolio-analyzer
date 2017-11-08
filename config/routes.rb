Rails.application.routes.draw do
  scope '/api' do
    get '/portfolios/lastPrice', to: 'trades#last_price'
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    resources :stock_symbols, only: [:index]
    get '/trades/refresh', to: 'trades#load_latest_prices_bulk'
    get '/stock_symbols/refresh', to: 'stock_symbols#refresh_from_feed'
    get '/headlines', to: 'application#headlines'
  end
end
