class IndexSerializer < ActiveModel::Serializer
  attributes :id, :stock_symbol, :trade_date, :trade_price, :price_change, :created_at, :error
end
