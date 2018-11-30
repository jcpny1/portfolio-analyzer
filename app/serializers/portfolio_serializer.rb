# This serializer describes the data to be sent for Portfolio requests.
class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name, :user
  has_many :positions
end
