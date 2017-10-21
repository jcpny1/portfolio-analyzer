class DailyTradesController < ApplicationController

  # https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo

  # {
  #   "Meta Data"=>
  #   {
  #     "1. Information"=>"Intraday (1min) prices and volumes",
  #     "2. Symbol"=>"MSFT",
  #     "3. Last Refreshed"=>"2017-10-20 16:00:00",
  #     "4. Interval"=>"1min",
  #     "5. Output Size"=>"Compact",
  #     "6. Time Zone"=>"US/Eastern"
  #   },
  #   "Time Series (1min)"=>
  #   {
  #     "2017-10-20 16:00:00"=>
  #     {
  #       "1. open"=>"78.7000",
  #       "2. high"=>"78.8100",
  #       "3. low"=>"78.6950",
  #       "4. close"=>"78.8100",
  #       "5. volume"=>"2663315"
  #     },
  #     "2017-10-20 15:59:00"=>
  #     {
  #       "1. open"=>"78.7000",
  #       "2. high"=>"78.7200",
  #       "3. low"=>"78.6900",
  #       "4. close"=>"78.7000",
  #       "5. volume"=>"320215"
  #     },
  #     .
  #     .
  #     .
  #   }
  # }

  # Retrieve the latest closing price for the supplied symbols.
  def last_close
    symbols = params['symbols'].split(',').uniq
    last_close_prices = {}

    begin
      conn = Faraday.new(:url => 'https://www.alphavantage.co/query')

      symbols.each { |symbol|
        resp = conn.get do |req|
          req.params['apikey']   = ENV['ALPHA_VANTAGE_API_KEY']
          req.params['function'] = 'TIME_SERIES_INTRADAY'
          req.params['interval'] = '1min'
          req.params['symbol']   = symbol
        end

        response = JSON.parse(resp.body)
        last_close_prices[symbol] = {}

        if response.key?('Error Message') then
          last_close_prices[symbol]['header'] = {'0. Error' => response['Error Message']}
        else
          last_close_prices[symbol]['header'] = response['Meta Data']
          last_close_prices[symbol]['tick']   = response['Time Series (1min)'].first
        end
      }

    rescue Faraday::ClientError => e
        puts "Faraday client error: #{e}"
    end

    render json: last_close_prices
  end
end
