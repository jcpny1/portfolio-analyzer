import React from 'react';

export const Help = () => {
  return (
    <div>
      <h3>No Investment Advice or Recommendations</h3>
      <ul>
        <li>The content of the Portfolio-Analyzer app is for education and entertainment purposes only.</li>
        <li>No decisions should be based on this app.</li>
        <li>Any information contained herein should be verfied through other sources.</li>
      </ul>
      <h3>No Security</h3>
      <ul>
        <li>The application is currently configured such that all users share the same public account.</li>
        <li>Any data you enter is viewable and changeable by any other user at any time.</li>
      </ul>
      <h3>Market Data</h3>
      <ul>
        <li>Latest trade data provided for free by <a href='https://iextrading.com/developer' target='_blank' rel='noopener noreferrer'>IEX</a>. <a href='https://iextrading.com/api-exhibit-a' target="_blank" rel='noopener noreferrer'>(IEX Terms Of Service)</a></li>
        <li>Index data (specifically, the DJIA) is provided by <a href='https://www.alphavantage.co' target='_blank' rel='noopener noreferrer'>Alpha Vantage</a>.</li>
        <li>Note that the prices shown may not be the correct prices or the latest prices.</li>
        <li>Any prices displayed should be verfied through other sources.</li>
        <li>When the application is first opened, the prices displayed are from the last time someone refreshed a portfolio containing those same symbols. Pressing refresh will update those prices from the latest available prices.</li>
        <li>Day change values are calculated based on the previous close price, not the current open price.</li>
      </ul>
      <h3>Portfolio Charts</h3>
      <ul>
        <li>Monthly adjusted price data provided by <a href='https://www.alphavantage.co' target='_blank' rel='noopener noreferrer'>Alpha Vantage</a>.</li>
        <li>The chart start date will be the earliest date where all portfolio instruments have data (to a maximum of 5 years ago).</li>
      </ul>
      <h3>Headline News</h3>
      <ul>
        <li>Bloomberg News is provided by <a href='https://newsapi.org' target='_blank' rel='noopener noreferrer'>NewsAPI.org</a>.</li>
        <li>Headlines are set to refresh every 5 minutes.</li>
        <li>The DJIA index is set to refresh every 1 minute.</li>
      </ul>
      <h3>Symbol Lookup</h3>
      <ul>
        <li>Accepts wildcard character '%'.</li>
      </ul>
      <h3>Known issues:</h3>
      <ul>
        <li>Series chart data is not provided by the feed vendor for every instrument.</li>
        <li>Series chart data provided by the feed vendor may or may not include the latest trading day.</li>
        <li>Due to free license restrictions, Headline News may post an error popup if the request limit is reached.</li>
        <li>Some server errors will display popups meant for development debugging purposes. This is expected since this is a development environment.</li>
      </ul>
    </div>
  );
}
