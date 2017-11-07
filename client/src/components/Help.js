import React from 'react';

const Help = (props) => {
  return (
    <div>
      <h3>No Investment Advice or Recommendations</h3>
      <ul>
        <li>The content of the Stock-Analyzer app is for education and entertainment purposes only.</li>
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
        <li>Data provided for free by <a href='https://iextrading.com/developer' target='_blank' rel='noopener noreferrer'>IEX</a>. <a href='https://iextrading.com/api-exhibit-a' target="_blank" rel='noopener noreferrer'>(IEX Terms Of Service)</a></li>
        <li>Note that the prices shown may not be the correct prices or the latest prices.</li>
        <li>Any prices displayed should be verfied through other sources.</li>
        <li>When the application is first opened, the position prices displayed are from the last time someone refreshed their portfolio containing those same symbols. Pressing refresh will update those prices from the market data feed, if it is available.</li>
      </ul>
      <h3>Symbol Lookup</h3>
      <ul>
        <li>Accepts wildcard character '%'.</li>
      </ul>
    </div>
  );
}

export default Help;
