class TradesController < ApplicationController
   include Yahoo

  # Retrieve the latest prices for the supplied symbols.
  # from live feed if 'livePrices' is specified. Else, from database.

  # NOTE: Keep symbols array and trades array in sync by symbol name.
  #       Use trade.error to signal a failed price fetch.

  # TODO Combine symbols and trades arrays into a single object.

  def latest_prices
    symbols = symbolsForUser(params['userId'])
    trades = Array.new(symbols.length)

    if params.key?('livePrices')
      # Fetch live prices
      fillTrades(symbols, trades);
      # Save new prices to database.
      trades.each_with_index { |trade, i|
        if trade.trade_price.nil?
          trades[i] = error_trade(symbols[i], "Failed to get price for #{symbols[i]}", true)
        else
          begin
            trade.save
          rescue ActiveRecord::ActiveRecordError => e
            puts "Error saving trade: #{trade.inspect}, #{e}"
          end
        end
      }
    else  # not fetching live prices.
      # Load last saved prices from database.
      symbols.each_with_index { |symbol, i|
        stock_symbol = StockSymbol.find_by(name: symbol)
        if !stock_symbol.nil?
          trade = Trade.where('stock_symbol_id = ?', stock_symbol.id).order('trade_date DESC, created_at DESC').first
          if !trade.nil?
            trades[i] = trade
          else
            trades[i] = error_trade(symbol, nil)
          end
        else
          trades[i] = error_trade(symbol, 'Invalid symbol: (' + symbol + ').')
        end
      }
    end
    render json: trades, each_serializer: TradeSerializer
  end

  # TODO Consolidate these two functions into one place in common with yahoo.rb
  def error_trade(symbol, errorMsg, logMsg = false)
    puts errorMsg if logMsg
    Trade.new(stock_symbol: StockSymbol.new(name: symbol), error: errorMsg)
  end

  def fetch_failure(symbols, trades, errorMsg)
    symbols.each_with_index { |symbol, i|
      trades[i] = error_trade(symbol, errorMsg, true)
    }
  end

  def symbolsForUser(user_id)
    symbols = []
    portfolios = Portfolio.where('user_id = ?', params['userId'])
    portfolios.each { |portfolio|
      portfolio.positions.each { |position|
        symbols.push(position.stock_symbol.name)
      }
    }.uniq
    symbols
  end
end
