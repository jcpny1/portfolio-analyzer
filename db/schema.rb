# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170929135938) do

  create_table "portfolios", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "name"], name: "index_portfolios_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_portfolios_on_user_id"
  end

  create_table "positions", force: :cascade do |t|
    t.integer "portfolio_id", null: false
    t.integer "stock_symbol_id", null: false
    t.decimal "quantity", null: false
    t.decimal "cost", null: false
    t.date "date_acquired", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["portfolio_id"], name: "index_positions_on_portfolio_id"
    t.index ["stock_symbol_id"], name: "index_positions_on_stock_symbol_id"
  end

  create_table "stock_symbols", force: :cascade do |t|
    t.string "name", null: false
    t.string "long_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["long_name"], name: "index_stock_symbols_on_long_name"
  end

  create_table "trades", force: :cascade do |t|
    t.integer "stock_symbol_id", null: false
    t.datetime "trade_date", null: false
    t.decimal "trade_price", null: false
    t.decimal "price_change", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stock_symbol_id", "trade_date"], name: "index_trades_on_stock_symbol_id_and_trade_date"
    t.index ["stock_symbol_id"], name: "index_trades_on_stock_symbol_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
