# This serializer describes the data to be sent for Series data requests.
class InstrumentSeriesSerializer < ActiveModel::Serializer
  attributes :id, :symbol, :name, :series
end
