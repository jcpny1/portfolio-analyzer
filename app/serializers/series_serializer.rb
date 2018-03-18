# This serializer describes the data to be sent for Series data requests.
# Series values are represented with a Trade object.
class SeriesSerializer < ActiveModel::Serializer
  attributes :id, :series_date, :adjusted_close_price, :dividend_amount, :created_at, :error
  has_one :instrument
end
