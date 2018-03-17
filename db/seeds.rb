# seeds.rb
#
# This seed file produces the following values:
#   Users       :   1
#   Portfolios  :   2
#   Positions   :  13
#   Instruments :  12
#   Trades      :  12
#   yielding account values of:
#     MarketValue: 417448.422
#     DayChange  :   2403.602
#     CostBasis  : 237882.58
#     GainLoss   : 179565.842

Instrument.create(symbol: 'AAPL',  name: 'Apple Inc.')
Instrument.create(symbol: 'AMZN',  name: 'Amazon.com Inc.')
Instrument.create(symbol: 'BABA',  name: 'Alibaba Group Holding Limited')
Instrument.create(symbol: 'COF',   name: 'Capital One Financial Corporation')
Instrument.create(symbol: 'DIA',   name: 'SPDR Dow Jones Industrial Average')
Instrument.create(symbol: 'FBGX',  name: 'UBS AG FI Enhanced Large Cap Growth ETN')
Instrument.create(symbol: 'GOOG',  name: 'Alphabet Inc.')
Instrument.create(symbol: 'GOOGL', name: 'Alphabet Inc.')
Instrument.create(symbol: 'GSK',   name: 'GlaxoSmithKline PLC')
Instrument.create(symbol: 'HD',    name: 'Home Depot Inc. (The)')
Instrument.create(symbol: 'INTC',  name: 'Intel Corporation')
Instrument.create(symbol: 'IWM',   name: 'iShares Russell 2000')
Instrument.create(symbol: 'JNJ',   name: 'Johnson & Johnson')
Instrument.create(symbol: 'QQQ',   name: 'PowerShares QQQ Trust Series 1')
Instrument.create(symbol: 'SNY',   name: 'Sanofi American Depositary Shares (Each repstg one-half of one)')
Instrument.create(symbol: 'SPY',   name: 'SPDR S&P 500')
Instrument.create(symbol: 'URTH',  name: 'Ishares MSCI World Index Fund')

u = User.create!(name: 'guest', email: '', locale: 'en-US')

p = Portfolio.create(user: u, name: 'Portfolio 5')
p.positions.new(instrument: Instrument.where('symbol = ?', 'AAPL').first, quantity: 156.4515, cost: 11273.96, date_acquired: Date.new(2011,8,2))
p.positions.new(instrument: Instrument.where('symbol = ?', 'AMZN').first, quantity:   1,      cost:  1000.00, date_acquired: Date.new(2011,8,2))
p.positions.new(instrument: Instrument.where('symbol = ?', 'COF' ).first, quantity: 344,      cost: 23256.47, date_acquired: Date.new(2011,8,2))
p.positions.new(instrument: Instrument.where('symbol = ?', 'FBGX').first, quantity: 393,      cost: 38276.93, date_acquired: Date.new(2011,8,2))
p.positions.new(instrument: Instrument.where('symbol = ?', 'HD'  ).first, quantity: 104,      cost:  8293.00, date_acquired: Date.new(2011,8,2))
p.save!

p = Portfolio.create(user: u, name: "Crazy 8's")
p.positions.new(instrument: Instrument.where('symbol = ?', 'AMZN' ).first, quantity:  52, cost: 16058.29, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'BABA' ).first, quantity: 146, cost: 17046.96, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'GOOG' ).first, quantity:   7, cost:  3022.70, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'GOOGL').first, quantity:  35, cost: 16619.66, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'GSK'  ).first, quantity: 474, cost: 24746.06, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'INTC' ).first, quantity: 742, cost: 16749.15, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'JNJ'  ).first, quantity: 425, cost: 39876.54, date_acquired: Date.new(2013,11,12))
p.positions.new(instrument: Instrument.where('symbol = ?', 'SNY'  ).first, quantity: 450, cost: 21662.86, date_acquired: Date.new(2013,11,12))
p.save!

Series.create(instrument: Instrument.where('symbol = ?', 'AAPL' ).first, time_interval: "MA", series_date: "2017-12-31", open_price: 123.450, high_price: 133.450, low_price: 113.450, close_price: 128.450, adjusted_close_price: 128.450, volume: 112561, dividend_amount: 1.48)
Series.create(instrument: Instrument.where('symbol = ?', 'AAPL' ).first, time_interval: "MA", series_date: "2018-01-31", open_price: 128.650, high_price: 143.450, low_price: 123.450, close_price: 138.450, adjusted_close_price: 138.450, volume: 162561, dividend_amount: 0.0)

Trade.create(instrument: Instrument.where('symbol = ?', 'AAPL' ).first, trade_date: '2000-01-01 20:08:00.293', trade_price:  171.50, price_change:  4.39)
Trade.create(instrument: Instrument.where('symbol = ?', 'AMZN' ).first, trade_date: '2000-01-01 20:04:00.001', trade_price: 1110.60, price_change: 17.38)
Trade.create(instrument: Instrument.where('symbol = ?', 'BABA' ).first, trade_date: '2000-12-31 20:01:24.201', trade_price:  182.21, price_change: -1.60)
Trade.create(instrument: Instrument.where('symbol = ?', 'COF'  ).first, trade_date: '2000-12-31 20:09:22.610', trade_price:   90.60, price_change: -0.85)
Trade.create(instrument: Instrument.where('symbol = ?', 'FBGX' ).first, trade_date: '2000-12-31 20:07:00.075', trade_price:  211.80, price_change:  2.49)
Trade.create(instrument: Instrument.where('symbol = ?', 'GOOG' ).first, trade_date: '2000-12-31 20:03:00.236', trade_price: 1031.48, price_change:  6.90)
Trade.create(instrument: Instrument.where('symbol = ?', 'GOOGL').first, trade_date: '2000-01-01 20:02:00.243', trade_price: 1048.99, price_change:  7.02)
Trade.create(instrument: Instrument.where('symbol = ?', 'GSK'  ).first, trade_date: '2000-01-01 20:10:24.088', trade_price:   35.09, price_change: -0.21)
Trade.create(instrument: Instrument.where('symbol = ?', 'HD'   ).first, trade_date: '2000-01-01 20:10:24.088', trade_price:  163.39, price_change:  1.68)
Trade.create(instrument: Instrument.where('symbol = ?', 'INTC' ).first, trade_date: '2000-01-01 20:10:24.088', trade_price:   45.75, price_change:  0.17)
Trade.create(instrument: Instrument.where('symbol = ?', 'JNJ'  ).first, trade_date: '2000-12-31 20:05:39.738', trade_price:  139.08, price_change:  0.15)
Trade.create(instrument: Instrument.where('symbol = ?', 'SNY'  ).first, trade_date: '2000-01-01 20:06:03.386', trade_price:   44.74, price_change: -0.48)
