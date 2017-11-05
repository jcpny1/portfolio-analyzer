class StockSymbolSerializer < ActiveModel::Serializer
  attributes :id, :name, :long_name
end
