class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name, :marketValue, :totalCost
  has_many :open_positions  
end
