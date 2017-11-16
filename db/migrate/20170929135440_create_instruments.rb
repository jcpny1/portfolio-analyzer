# For this applicataion, we'll use symbol as the unique instrument identifier.
# If it was available, a CUSIP or ISIN would be the way to go.
class CreateInstruments < ActiveRecord::Migration[5.1]
  def change
    create_table :instruments do |t|
      t.string :symbol, null: false, unique: true
      t.string :name,   null: false
      t.timestamps
    end
  end
end
