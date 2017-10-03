class CreatePortfolios < ActiveRecord::Migration[5.1]
  def change
    create_table :portfolios do |t|
      t.references :user, foreign_key: true
      t.string :name,     null: false
      t.timestamps
    end
    add_index(:portfolios, [:user_id, :name], unique: true)
  end
end
