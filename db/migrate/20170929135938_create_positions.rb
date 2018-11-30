class CreatePositions < ActiveRecord::Migration[5.1]
  def change
    create_table :positions do |t|
      t.references :portfolio,     null: false, foreign_key: true
      t.references :instrument,    null: false, foreign_key: true
      t.decimal    :quantity,      null: false
      t.decimal    :cost,          null: false
      t.date       :date_acquired, null: false
      t.timestamps
    end
  end
end
