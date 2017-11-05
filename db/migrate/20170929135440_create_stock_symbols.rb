class CreateStockSymbols < ActiveRecord::Migration[5.1]
  def change
    create_table :stock_symbols do |t|
      t.string :name,      null: false, unique: true
      t.string :long_name, null: false
      t.timestamps
    end
    add_index(:stock_symbols, [:long_name])
  end
end
