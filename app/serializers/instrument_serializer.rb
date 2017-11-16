# This serializer describes the data to be sent for Instrument requests.
class InstrumentSerializer < ActiveModel::Serializer
  attributes :id, :symbol, :name
end
