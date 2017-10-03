class User < ApplicationRecord
  has_many :portfolios
  validates :name, presence: true
  validates :name, uniqueness: true
end
