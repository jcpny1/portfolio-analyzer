# seeds.rb
#
# This seed file produces the following values:
#   users       :     1
#   portfolios  :     2
#   positions   :    11
#   stockSymbols:    10
#   trades      :    10
#   yielding account values:
#     marketValue: 366869.262
#     dayChange  :   2377.002
#     costBasis  : 196387.37
#     gainLoss   : 170481.892

StockSymbol.create(name: 'AAPL',  long_name: 'APPLE INC')
StockSymbol.create(name: 'AMZN',  long_name: 'AMAZON COM INC')
StockSymbol.create(name: 'BABA',  long_name: 'ALIBABA GROUP HOLDING LIMITED (BABA)')
StockSymbol.create(name: 'COF',   long_name: 'Capital One Financial Corp')
StockSymbol.create(name: 'FBGX',  long_name: 'UBS AG FI ENHANCED LARGE CAP GROWTH ETN (FBGX)')
StockSymbol.create(name: 'GOOG',  long_name: 'GOOGLE INC. (GOOG)')
StockSymbol.create(name: 'GOOGL', long_name: 'Google Inc')
StockSymbol.create(name: 'HD',    long_name: 'HOME DEPOT INC')
StockSymbol.create(name: 'JNJ',   long_name: 'Johnson & Johnson')
StockSymbol.create(name: 'SNY',   long_name: 'SANOFI')

u = User.create!(name: 'guest', email: '')

p = Portfolio.create(user: u, name: 'Schwab 1')
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'AMZN' ).first, quantity:  52, cost: 16058.29, date_acquired: Date.new(2013,11,12))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'BABA' ).first, quantity: 146, cost: 17046.96, date_acquired: Date.new(2013,11,12))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'GOOG' ).first, quantity:   7, cost:  3022.70, date_acquired: Date.new(2013,11,12))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'GOOGL').first, quantity:  35, cost: 16619.66, date_acquired: Date.new(2013,11,12))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'JNJ'  ).first, quantity: 425, cost: 39876.54, date_acquired: Date.new(2013,11,12))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'SNY'  ).first, quantity: 450, cost: 21662.86, date_acquired: Date.new(2013,11,12))
p.save!

p = Portfolio.create(user: u, name: 'Schwab 2')
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'AAPL').first, quantity: 156.4515, cost: 11273.96, date_acquired: Date.new(2011,8,2))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'AMZN').first, quantity:   1,      cost:  1000.00, date_acquired: Date.new(2011,8,2))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'COF' ).first, quantity: 344,      cost: 23256.47, date_acquired: Date.new(2011,8,2))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'FBGX').first, quantity: 393,      cost: 38276.93, date_acquired: Date.new(2011,8,2))
p.positions.new(stock_symbol: StockSymbol.where('name = ?', 'HD'  ).first, quantity: 104,      cost:  8293.00, date_acquired: Date.new(2011,8,2))
p.save!

Trade.create(stock_symbol: StockSymbol.where('name = ?', 'AAPL' ).first, trade_date: '2000-01-01 20:08:00.293', trade_price:  171.50, price_change:  4.39)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'AMZN' ).first, trade_date: '2000-01-01 20:04:00.001', trade_price: 1110.60, price_change: 17.38)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'BABA' ).first, trade_date: '2000-12-31 20:01:24.201', trade_price:  182.21, price_change: -1.60)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'COF'  ).first, trade_date: '2000-12-31 20:09:22.610', trade_price:   90.60, price_change: -0.85)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'FBGX' ).first, trade_date: '2000-12-31 20:07:00.075', trade_price:  211.80, price_change:  2.49)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'GOOG' ).first, trade_date: '2000-12-31 20:03:00.236', trade_price: 1031.48, price_change:  6.90)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'GOOGL').first, trade_date: '2000-01-01 20:02:00.243', trade_price: 1048.99, price_change:  7.02)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'HD'   ).first, trade_date: '2000-01-01 20:10:24.088', trade_price:  163.39, price_change:  1.68)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'JNJ'  ).first, trade_date: '2000-12-31 20:05:39.738', trade_price:  139.08, price_change:  0.15)
Trade.create(stock_symbol: StockSymbol.where('name = ?', 'SNY'  ).first, trade_date: '2000-01-01 20:06:03.386', trade_price:   44.74, price_change: -0.48)
