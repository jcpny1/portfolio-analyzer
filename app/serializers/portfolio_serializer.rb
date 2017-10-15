class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name, :marketValue, :totalCost
  belongs_to :user
  has_many :open_positions
end
