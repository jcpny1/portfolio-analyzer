class DailyTradeSerializer < ActiveModel::Serializer
  attributes :id, :stock_symbol_id, :trade_date, :close_price
end
