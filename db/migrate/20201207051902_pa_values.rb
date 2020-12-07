class PaValues < ActiveRecord::Migration[6.0]
  def change
    create_table :pa_values do |t|
      t.string   :name,   null: false
      t.string   :value,  null: false
      t.timestamps
    end
  end
end
