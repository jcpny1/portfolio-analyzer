# A Series, for this application, represents an array of price points in time for a specific Instrument.
class Series < ApplicationRecord
  belongs_to :instrument
  attr_accessor :error
end
