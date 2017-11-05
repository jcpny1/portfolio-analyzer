Rails.application.routes.draw do
  scope '/api' do
    get '/portfolios/lastPrice', to: 'trades#last_price'
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    scope '/stock_symbols' do
      get '/by_long_name',  to: 'stock_symbols#by_long_name'
      get '/by_name/:name', to: 'stock_symbols#by_name'
      get '/refresh',       to: 'stock_symbols#refresh'
    end
  end
end
