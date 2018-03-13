# This serializer describes the data to be sent for Market Index requests.
# Market Index values are represented with a Trade object.
class SeriesSerializer < ActiveModel::Serializer
  attributes :id, :instrument, :trade_date, :trade_price, :price_change, :created_at, :error
end
