class OpenPositionSerializer < ActiveModel::Serializer
  attributes :id, :portfolio_id, :stock_symbol, :quantity, :cost, :date_acquired, :lastClosePrice
  belongs_to :portfolio
  belongs_to :stock_symbol
end
