class IndexSerializer < ActiveModel::Serializer
  attributes :id, :instrument, :trade_date, :trade_price, :price_change, :created_at, :error
end
