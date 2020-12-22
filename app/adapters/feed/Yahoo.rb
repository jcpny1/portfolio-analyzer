module Feed
  # This is the Investors Exchange API handler.
  ################################################
  # See the bottom of this file for sample data. #
  ################################################
  class Yahoo
    # Makes data request for an array of symbols.
    # Returns array of results.
    def self.DJIA()
      begin
        Rails.logger.debug "YAHOO PRICE FETCH BEGIN for: DJI."
        resp = Faraday.get("https://finance.yahoo.com/quote/%5EDJI?p=%5EDJI")
        Rails.logger.debug "YAHOO PRICE FETCH END   for: DJI."
      rescue Faraday::ClientError => e
        Rails.logger.error "YAHOO PRICE FETCH ERROR: Faraday client error: #{e}."
        Feed.error_trade(symbol, 'The feed is down.')
      rescue JSON::ParserError => e
        Rails.logger.error "YAHOO PRICE FETCH ERROR: JSON parse error: #{e}."
        Feed.error_trade(symbol, 'The feed is down.')
      rescue URI::InvalidURIError => e
        Rails.logger.error "YAHOO PRICE FETCH ERROR: Invalid URI: #{e}."
        Feed.error_trade(symbol, 'The feed is down.')
      else
        process_price_response(resp.body)
      end
    end

    ### private ###

    # Extract trade data or an error from the response.
    private_class_method def self.process_price_response(response)
      djia = Nokogiri::HTML.parse(response).css('div[data-reactid=30]')
      djia_response = {
        'price'  => djia.css('span[data-reactid=33]').text,
        'change' => djia.css('span[data-reactid=34]').text,
        'status' => djia.css('#quote-market-notice > span').text
      }
    end

    ###################
    ##  SAMPLE DATA  ##
    ###################
    #
    # Quote:
    # https://finance.yahoo.com/quote/%5EDJI?p=%5EDJI
    #
    # <div class="My(6px) Pos(r) smartphone_Mt(6px)" data-reactid="30">
    #   <div class="D(ib) Va(m) Maw(65%) Ov(h)" data-reactid="31">
    #     <div class="D(ib) Mend(20px)" data-reactid="32">
    #       <span class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)" data-reactid="33">30,103.34</span>
    #       <span class="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)" data-reactid="34">-113.11 (-0.37%)</span>
    #       <div id="quote-market-notice" class="C($tertiaryColor) D(b) Fz(12px) Fw(n) Mstart(0)--mobpsm Mt(6px)--mobpsm" data-reactid="35">
    #         <span data-reactid="36">As of  12:45PM EST. Market open.</span>
    #       </div>
    #     </div>
    #   </div>
    # </div>
    #
  end
end
