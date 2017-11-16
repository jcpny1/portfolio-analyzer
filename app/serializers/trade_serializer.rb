# This serializer describes the data to be sent for Trade requests.
# Market Data is also represented by a Trade, but a different serializer is used.
class TradeSerializer < ActiveModel::Serializer
  attributes :id, :instrument_id, :trade_date, :trade_price, :price_change, :created_at, :error
end
