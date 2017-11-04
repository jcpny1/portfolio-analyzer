Rails.application.routes.draw do
  scope '/api' do
    get '/portfolios/lastPrice', to: 'trades#last_price'
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    resources :companies, only: [:index]
    get '/stock_symbols/by_name/:name', to: 'stock_symbols#by_name'
    get '/stock_symbols/refresh', to: 'stock_symbols#refresh'
  end
end
