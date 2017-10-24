class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :name
  belongs_to :user
  has_many :open_positions
end
