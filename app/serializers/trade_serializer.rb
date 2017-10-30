class TradeSerializer < ActiveModel::Serializer
  attributes :id, :stock_symbol_id, :trade_date, :trade_price, :day_change, :error
end
