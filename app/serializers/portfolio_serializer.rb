class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :open_positions
end
