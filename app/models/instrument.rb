# An Instrument, in this application, is a tradable financial asset such as a stock.
class Instrument < ApplicationRecord
  has_many :trades
  has_many :series
  has_many :positions
  validates :symbol, presence: { message: 'is not valid' }
  validates :symbol, uniqueness: { case_sensitive: false }
end
