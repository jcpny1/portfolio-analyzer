class OpenPositionSerializer < ActiveModel::Serializer
  attributes :id, :portfolio_id, :stock_symbol, :quantity, :cost, :date_acquired, :gainLoss, :lastClosePrice, :marketValue
  belongs_to :portfolio
  belongs_to :stock_symbol
end
