class CreateDailyTrades < ActiveRecord::Migration[5.1]
  def change
    create_table :daily_trades do |t|
      t.references :stock_symbol, null: false, foreign_key: true
      t.integer    :trade_date,   null: false
      t.decimal    :open_price,   null: false
      t.decimal    :close_price,  null: false
      t.decimal    :high_price,   null: false
      t.decimal    :low_price,    null: false
      t.decimal    :trade_volume, null: false
      t.timestamps
    end
    add_index(:daily_trades, [:stock_symbol_id, :trade_date], unique: true)
  end
end
