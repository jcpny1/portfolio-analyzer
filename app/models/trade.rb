class Trade < ApplicationRecord
  belongs_to :stock_symbol
  attr_accessor :day_change, :error
end