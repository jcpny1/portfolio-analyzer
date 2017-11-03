class TradesController < ApplicationController
   include InvestorsExchange  # include Feed handler here.

  # Retrieve the latest prices for the supplied symbols.
  # from live feed if 'livePrices' is specified. Else, from database.
  # To handle case of feed down not trashing client's existing prices,
  # first load database latest prices, then overlay with whatever we
  # can get from live feed.
  # In a production environment, going to the database here would not
  # be necessary. The latest prices (live or otherwise) would be in an
  # in-memory cache.

  # NOTE: Keep symbols array and trades array in sync by symbol name.
  #       Use trade.error to signal a failed price fetch.
  #       For feeds without a last trade datetime, use year 1492 to signal its absence.

  # TODO Combine symbols and trades arrays into a single object.

  MISSING_TRADE_DATE_VALUE = 1492

  def last_price
    symbols = symbolsForUser(params['userId'])
    trades = Array.new(symbols.length)

    # Load last saved prices from database.
    symbols.each_with_index { |symbol, i|
      stock_symbol = StockSymbol.find_by(name: symbol)
      if !stock_symbol.nil?
        trade = Trade.where('stock_symbol_id = ?', stock_symbol.id).order('trade_date DESC, created_at DESC').first
        if !trade.nil?
          trades[i] = trade
        else
          trades[i] = error_trade(symbol, 'No trades available.')
        end
      else
        trades[i] = error_trade(symbol, 'Invalid symbol.')
      end
    }

    if params.key?('livePrices')
      liveTrades = Array.new(symbols.length)
      # Fetch live prices
      fillTrades(symbols, liveTrades);
      # Save new prices to database.
      liveTrades.each_with_index { |liveTrade, i|
        if !liveTrade.trade_price.nil?
          begin
            if((liveTrade.trade_price != trades[i].trade_price) || (trades[i].trade_date.to_f.round(4) > trades[i].trade_date.to_f.round(4)))
              liveTrade.save
              trades[i] = liveTrade
            end
          rescue ActiveRecord::ActiveRecordError => e
            puts "Error saving trade: #{trade.inspect}, #{e}"
          end
        else
          trades[i].error = liveTrade.error
        end
      }
    end
    render json: trades, each_serializer: TradeSerializer
  end

  # TODO Consolidate these two functions into one place in common with yahoo.rb
  def error_trade(symbol, errorMsg)
    Trade.new(stock_symbol: StockSymbol.new(name: symbol), error: "#{symbol}: #{errorMsg}")
  end

  def fetch_failure(symbols, trades, errorMsg)
    symbols.each_with_index { |symbol, i|
      trades[i] = error_trade(symbol, errorMsg)
    }
  end

  def missing_trade_date()
    return MISSING_TRADE_DATE_VALUE
  end

  def symbolsForUser(user_id)
    symbols = []
    portfolios = Portfolio.where('user_id = ?', params['userId'])
    portfolios.each { |portfolio|
      portfolio.positions.each { |position|
        symbols.push(position.stock_symbol.name)
      }
    }
    symbols.uniq
  end
end
