# A User (or investor) is the owner a one or more Portfolios.
class User < ApplicationRecord
  has_many :portfolios
  validates :name, presence: true
  validates :name, uniqueness: true
end
