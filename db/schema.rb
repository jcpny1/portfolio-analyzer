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

ActiveRecord::Schema.define(version: 20180313194331) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "instruments", force: :cascade do |t|
    t.string "symbol", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "portfolios", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "name"], name: "index_portfolios_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_portfolios_on_user_id"
  end

  create_table "positions", force: :cascade do |t|
    t.bigint "portfolio_id", null: false
    t.bigint "instrument_id", null: false
    t.decimal "quantity", null: false
    t.decimal "cost", null: false
    t.date "date_acquired", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument_id"], name: "index_positions_on_instrument_id"
    t.index ["portfolio_id"], name: "index_positions_on_portfolio_id"
  end

  create_table "series", force: :cascade do |t|
    t.bigint "instrument_id", null: false
    t.string "time_interval", null: false
    t.datetime "series_date", null: false
    t.decimal "open_price", null: false
    t.decimal "high_price", null: false
    t.decimal "low_price", null: false
    t.decimal "close_price", null: false
    t.decimal "adjusted_close_price", null: false
    t.decimal "volume", null: false
    t.decimal "dividend_amount", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument_id", "time_interval", "series_date"], name: "index_series_on_instrument_id_and_time_interval_and_series_date", unique: true
    t.index ["instrument_id"], name: "index_series_on_instrument_id"
  end

  create_table "trades", force: :cascade do |t|
    t.bigint "instrument_id", null: false
    t.datetime "trade_date", null: false
    t.decimal "trade_price", null: false
    t.decimal "price_change", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument_id", "trade_date"], name: "index_trades_on_instrument_id_and_trade_date"
    t.index ["instrument_id"], name: "index_trades_on_instrument_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "locale", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "portfolios", "users"
  add_foreign_key "positions", "instruments"
  add_foreign_key "positions", "portfolios"
  add_foreign_key "series", "instruments"
  add_foreign_key "trades", "instruments"
end
