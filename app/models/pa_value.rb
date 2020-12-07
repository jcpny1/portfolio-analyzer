# A User (or investor) is the owner a one or more Portfolios.
class PaValue < ApplicationRecord
  validates :name, uniqueness: true
end
