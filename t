[1mdiff --git a/app/models/stock_symbol.rb b/app/models/stock_symbol.rb[m
[1mindex 9b79e6b..9d8b29a 100644[m
[1m--- a/app/models/stock_symbol.rb[m
[1m+++ b/app/models/stock_symbol.rb[m
[36m@@ -5,9 +5,56 @@[m [mclass StockSymbol < ApplicationRecord[m
   validates :name, presence: true[m
   validates :name, uniqueness: {case_sensitive: false}[m
 [m
[31m-  # Returns the latest closing price available or 0, if no price is available.[m
   def lastClosePrice[m
[31m-    last_close_record = DailyTrade.where('stock_symbol_id = ?', self.id).order('trade_date DESC').first[m
[31m-    last_close_record.present? ? last_close_record.close_price : 0.0[m
[32m+[m[32m    if @lastClosePrice.nil?[m
[32m+[m[32m      lastPrices[m
[32m+[m[32m    end[m
[32m+[m[32m    @lastClosePrice[m
[32m+[m[32m  end[m
[32m+[m
[32m+[m
[32m+[m[32m  # Update self with the latest prices available.[m
[32m+[m[32m  def lastPrices[m
[32m+[m[32m    # latest_prices(self).close_price[m
[32m+[m
[32m+[m[32mputs "START price fetch for: " + self.name[m
[32m+[m
[32m+[m[32m    api_key = ENV['ALPHA_VANTAGE_API_KEY'][m
[32m+[m[32m    daily_trade = DailyTrade.new[m
[32m+[m[32m    prices = {}[m
[32m+[m
[32m+[m[32m    begin[m
[32m+[m[32m      conn = Faraday.new(:url => 'https://www.alphavantage.co/query')[m
[32m+[m
[32m+[m[32m      resp = conn.get do |req|[m
[32m+[m[32m        req.params['function'] = 'TIME_SERIES_INTRADAY'[m
[32m+[m[32m        req.params['interval'] = '1min'[m
[32m+[m[32m        req.params['symbol']   = self.name[m
[32m+[m[32m        req.params['apikey']   = api_key[m
[32m+[m[32m      end[m
[32m+[m[32m      response = JSON.parse(resp.body)[m
[32m+[m
[32m+[m[32mputs "FETCH complete for: " + self.name[m
[32m+[m
[32m+[m[32m      if response.key?('Error Message')[m
[32m+[m[32m        prices['header'] = {'0. Error' => response['Error Message']}[m
[32m+[m[32m      else[m
[32m+[m[32m        prices['header'] = response['Meta Data'][m
[32m+[m[32m        prices['tick']   = response['Time Series (1min)'].first[m
[32m+[m[32m      end[m
[32m+[m
[32m+[m[32m      daily_trade.stock_symbol = self[m
[32m+[m[32m      daily_trade.close_price  = prices['tick'].second['4. close'].to_f[m
[32m+[m
[32m+[m[32m    rescue Faraday::ClientError => e[m
[32m+[m[32m        puts "Faraday client error: #{e}"[m
[32m+[m[32m    end[m
[32m+[m
[32m+[m[32mputs "END   price fetch for: " + self.name[m
[32m+[m
[32m+[m[32m    @lastClosePrice = daily_trade.close_price[m
[32m+[m
[32m+[m[32m    # last_close_record = DailyTrade.where('stock_symbol_id = ?', self.id).order('trade_date DESC').first[m
[32m+[m[32m    # last_close_record.present? ? last_close_record.close_price : 0.0[m
   end[m
 end[m
