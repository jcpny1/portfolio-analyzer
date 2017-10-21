class StockSymbolSerializer < ActiveModel::Serializer
  attributes :id, :name, :trading_name, :company
end
