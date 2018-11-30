class CreateSeries < ActiveRecord::Migration[5.1]
  def change
    create_table :series do |t|
      t.references :instrument,           null: false, foreign_key: true
      t.string     :time_interval,        null: false
      t.datetime   :series_date,          null: false
      t.decimal    :open_price,           null: false
      t.decimal    :high_price,           null: false
      t.decimal    :low_price,            null: false
      t.decimal    :close_price,          null: false
      t.decimal    :adjusted_close_price, null: false
      t.decimal    :volume,               null: false
      t.decimal    :dividend_amount,      null: false
      t.timestamps
    end
    add_index(:series, [:instrument_id, :time_interval, :series_date], unique: true)
  end
end
