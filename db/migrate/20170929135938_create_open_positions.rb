class CreateOpenPositions < ActiveRecord::Migration[5.1]
  def change
    create_table :open_positions do |t|
      t.references :portfolio,    foreign_key: true
      t.references :stock_symbol, foreign_key: true
      t.decimal    :quantity
      t.decimal    :cost
      t.date       :date_acquired
      t.timestamps
    end
  end
end
