class Trade < ApplicationRecord
  belongs_to :instrument
  attr_accessor :error
end
