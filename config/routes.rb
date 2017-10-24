Rails.application.routes.draw do
  scope '/api' do
    resources :portfolios do
      resources :open_positions, only: [:create, :update, :destroy]
    end
    resources :stock_symbols, only: [:index]
  end
end
