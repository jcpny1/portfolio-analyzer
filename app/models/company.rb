class Company < ApplicationRecord
  has_many :stock_symbols
  validates :name, presence: true
end
