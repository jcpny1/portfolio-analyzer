class OpenPositionSerializer < ActiveModel::Serializer
  attributes :id, :portfolio_id, :stock_symbol, :quantity, :cost, :date_acquired
  belongs_to :portfolio
  belongs_to :stock_symbol
end
