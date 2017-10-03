class CreateStockSymbols < ActiveRecord::Migration[5.1]
  def change
    create_table :stock_symbols do |t|
      t.string     :name,         null: false, unique: true
      t.string     :trading_name, null: false
      t.references :company,      null: false, foreign_key: true
      t.timestamps
    end
  end
end
