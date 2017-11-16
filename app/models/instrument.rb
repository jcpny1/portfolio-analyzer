class Instrument < ApplicationRecord
  has_many :trades
  has_many :positions
  validates :symbol, presence: { message: 'is not valid' }
  validates :symbol, uniqueness: { case_sensitive: false }
end
