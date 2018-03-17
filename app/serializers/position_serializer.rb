# This serializer describes the data to be sent for Position requests.
class PositionSerializer < ActiveModel::Serializer
  attributes :id, :portfolio_id, :quantity, :cost, :date_acquired
  has_one :instrument
end
