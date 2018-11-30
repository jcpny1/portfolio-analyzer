class CreateTrades < ActiveRecord::Migration[5.1]
  def change
    create_table :trades do |t|
      t.references :instrument,   null: false, foreign_key: true
      t.datetime   :trade_date,   null: false
      t.decimal    :trade_price,  null: false
      t.decimal    :price_change, null: false
      t.timestamps
    end
    add_index(:trades, [:instrument_id, :trade_date])
  end
end
