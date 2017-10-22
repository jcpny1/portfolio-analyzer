class StockSymbol < ApplicationRecord
  belongs_to :company
  has_many :daily_trades
  has_many :open_positions
  validates :name, presence: true
  validates :name, uniqueness: {case_sensitive: false}

  def lastClosePrice
    if @lastClosePrice.nil?
      lastPrices
    end
    @lastClosePrice
  end


  # Update self with the latest prices available.
  def lastPrices
    # latest_prices(self).close_price

puts "START price fetch for: " + self.name

    api_key = ENV['ALPHA_VANTAGE_API_KEY']
    daily_trade = DailyTrade.new
    prices = {}

    begin
      conn = Faraday.new(:url => 'https://www.alphavantage.co/query')

      resp = conn.get do |req|
        req.params['function'] = 'TIME_SERIES_INTRADAY'
        req.params['interval'] = '1min'
        req.params['symbol']   = self.name
        req.params['apikey']   = api_key
      end
      response = JSON.parse(resp.body)

puts "FETCH complete for: " + self.name

      if response.key?('Error Message')
        prices['header'] = {'0. Error' => response['Error Message']}
      else
        prices['header'] = response['Meta Data']
        prices['tick']   = response['Time Series (1min)'].first
      end

      daily_trade.stock_symbol = self
      daily_trade.close_price  = prices['tick'].second['4. close'].to_f

    rescue Faraday::ClientError => e
        puts "Faraday client error: #{e}"
    end

puts "END   price fetch for: " + self.name

    @lastClosePrice = daily_trade.close_price

    # last_close_record = DailyTrade.where('stock_symbol_id = ?', self.id).order('trade_date DESC').first
    # last_close_record.present? ? last_close_record.close_price : 0.0
  end
end
