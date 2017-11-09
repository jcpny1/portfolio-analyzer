[1mdiff --git a/app/controllers/concerns/alphavantage.rb b/app/controllers/concerns/alphavantage.rb[m
[1mindex 20b3170..6155f94 100644[m
[1m--- a/app/controllers/concerns/alphavantage.rb[m
[1m+++ b/app/controllers/concerns/alphavantage.rb[m
[36m@@ -18,13 +18,13 @@[m [mmodule Alphavantage extend ActiveSupport::Concern[m
 [m
     symbols.each_with_index { |symbol, i|[m
       begin[m
[31m-        logger.debug "AA PRICE FETCH BEGIN for: #{symbol}."[m
[31m-        resp = conn.get do |req|[m
[32m+[m[32m        logger.info "AA PRICE FETCH BEGIN for: #{symbol}."[m
[32m+[m[32m      logger.info = conn.get do |req|[m
           req.params['function'] = 'TIME_SERIES_DAILY'[m
           req.params['symbol']   = symbol[m
           req.params['apikey']   = api_key[m
         end[m
[31m-        logger.debug "AA PRICE FETCH END   for: #{symbol}."[m
[32m+[m[32m        logger.info "AA PRICE FETCH END   for: #{symbol}."[m
         response = JSON.parse(resp.body)[m
       rescue Faraday::ClientError => e[m
         logger.error "AA PRICE FETCH ERROR for: #{symbolList}: Faraday client error: #{e}."[m
[36m@@ -63,8 +63,8 @@[m [mmodule Alphavantage extend ActiveSupport::Concern[m
 [m
   # Return the feed's list if valid symbols.[m
   def getSymbology()[m
[31m-    logger.debug 'AA SYMBOLOGY FETCH BEGIN.'[m
[31m-    logger.debug 'AA SYMBOLOGY FETCH END.'[m
[32m+[m[32m    logger.info 'AA SYMBOLOGY FETCH BEGIN.'[m
[32m+[m[32m    logger.info 'AA SYMBOLOGY FETCH END.'[m
     return {}[m
   end[m
 end[m
[1mdiff --git a/app/controllers/concerns/investors_exchange.rb b/app/controllers/concerns/investors_exchange.rb[m
[1mindex bb71be4..fcd4889 100644[m
[1m--- a/app/controllers/concerns/investors_exchange.rb[m
[1m+++ b/app/controllers/concerns/investors_exchange.rb[m
[36m@@ -11,9 +11,9 @@[m [mmodule InvestorsExchange extend ActiveSupport::Concern[m
     uri.query_values = {types: 'quote', filter: 'companyName,latestPrice,change,latestUpdate', symbols: symbolList}[m
 [m
     begin[m
[31m-      logger.debug "IEX PRICE FETCH BEGIN for: #{symbolList}."[m
[32m+[m[32m      logger.info "IEX PRICE FETCH BEGIN for: #{symbolList}."[m
       resp = Faraday.get(uri)[m
[31m-      logger.debug "IEX PRICE FETCH END   for: #{symbolList}."[m
[32m+[m[32m      logger.info "IEX PRICE FETCH END   for: #{symbolList}."[m
       response = JSON.parse(resp.body)[m
     rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.[m
       logger.error "IEX PRICE FETCH ERROR for: #{symbolList}: Faraday client error: #{e}."[m
[36m@@ -50,9 +50,9 @@[m [mmodule InvestorsExchange extend ActiveSupport::Concern[m
   def getSymbology()[m
     begin[m
       response = {}[m
[31m-      logger.debug 'IEX SYMBOLOGY FETCH BEGIN.'[m
[32m+[m[32m      logger.info 'IEX SYMBOLOGY FETCH BEGIN.'[m
       resp = Faraday.get('https://api.iextrading.com/1.0/ref-data/symbols')[m
[31m-      logger.debug 'IEX SYMBOLOGY FETCH END.'[m
[32m+[m[32m      logger.info 'IEX SYMBOLOGY FETCH END.'[m
       response = JSON.parse(resp.body)[m
     rescue Faraday::ClientError => e  # Can't connect.[m
       logger.error "IEX SYMBOLOGY FETCH ERROR: Faraday client error: #{e}."[m
[1mdiff --git a/app/controllers/concerns/yahoo.rb b/app/controllers/concerns/yahoo.rb[m
[1mindex af04d8f..c422c81 100644[m
[1m--- a/app/controllers/concerns/yahoo.rb[m
[1m+++ b/app/controllers/concerns/yahoo.rb[m
[36m@@ -16,10 +16,10 @@[m [mmodule Yahoo extend ActiveSupport::Concern[m
     symbol_list = symbols.join('+')[m
     trades = Array.new(symbols.length)[m
     begin[m
[31m-      logger.debug "YAHOO PRICE FETCH BEGIN for: #{symbol_list}."[m
[32m+[m[32m      logger.info "YAHOO PRICE FETCH BEGIN for: #{symbol_list}."[m
       conn = Faraday.new(url: "https://download.finance.yahoo.com/d/quotes.csv")[m
       resp = conn.get '', {s: symbol_list, f: 'sl1d1t1c1'}[m
[31m-      logger.debug "YAHOO PRICE FETCH END   for: #{symbol_list}."[m
[32m+[m[32m      logger.info "YAHOO PRICE FETCH END   for: #{symbol_list}."[m
       response = CSV.parse(resp.body)[m
       raise LoadError, 'The feed is down.' if resp.body.include? '999 Unable to process request at this time'[m
     rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.[m
[36m@@ -51,7 +51,7 @@[m [mmodule Yahoo extend ActiveSupport::Concern[m
             # TODO Replace 'EDT' with proper timezone info.[m
             trade = Trade.new do |t|[m
               t.stock_symbol = StockSymbol.find_by(name: symbol)[m
[31m-              t.trade_date   = DateTime.strptime("#{response_row[LAST_TRADE_DATE_COL]} #{response[response_index][LAST_TRADE_TIME_COL]} EDT", '%m/%d/%Y %l:%M%P %Z').to_f/1000.0).round(4).to_datetime[m
[32m+[m[32m              t.trade_date   = DateTime.strptime("#{response_row[LAST_TRADE_DATE_COL]} #{response[response_index][LAST_TRADE_TIME_COL]} EDT", '%m/%d/%Y %l:%M%P %Z').to_f/1000.0.round(4).to_datetime[m
               t.trade_price  = response_row[LAST_TRADE_PRICE_COL].to_f.round(4)[m
               t.price_change = response_row[DAY_CHANGE_COL].to_f.round(4)[m
               t.created_at   = fetch_time[m
[36m@@ -66,8 +66,8 @@[m [mmodule Yahoo extend ActiveSupport::Concern[m
 [m
   # Return the feed's list if valid symbols.[m
   def getSymbology()[m
[31m-    logger.debug 'YAHOO SYMBOLOGY FETCH BEGIN.'[m
[31m-    logger.debug 'YAHOO SYMBOLOGY FETCH END.'[m
[32m+[m[32m    logger.info 'YAHOO SYMBOLOGY FETCH BEGIN.'[m
[32m+[m[32m    logger.info 'YAHOO SYMBOLOGY FETCH END.'[m
     return {}[m
   end[m
 end[m
