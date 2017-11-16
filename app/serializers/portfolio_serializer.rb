# This serializer describes the data to be sent for Portfolio requests.
class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name, :user
  belongs_to :user
  has_many :positions
end
