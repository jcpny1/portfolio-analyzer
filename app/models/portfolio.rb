class Portfolio < ApplicationRecord
  belongs_to :user
  has_many :positions, dependent: :destroy, inverse_of: :portfolio
  has_many :stock_symbols, through: :positions
  validates :name, presence: true
  validates :name, uniqueness: { scope: :user, message: 'already exists' }
end
