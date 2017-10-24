class Portfolio < ApplicationRecord
  belongs_to :user
  has_many :open_positions, dependent: :destroy, inverse_of: :portfolio
  validates :name, presence: true
  validates :name, uniqueness: {scope: :user, message: "already exists"}
end
