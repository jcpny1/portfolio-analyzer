class TradeSerializer < ActiveModel::Serializer
  attributes :id, :stock_symbol_id, :trade_date, :trade_price, :price_change, :error
end
