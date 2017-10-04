import fetch from 'isomorphic-fetch';

export function fetchPositions(portfolio_id) {
  return function(dispatch) {
    dispatch( {type: 'LOADING_POSITIONS'} )
    return fetch('/api/portfolios/' + portfolio_id)
      .then(res => {return res.json()})
      .then(responseJson => {dispatch( {type: 'FETCH_POSITIONS', payload: responseJson} )});
  }
}

// .then(Client.checkStatus)
// .then(Client.parseJSON)

export function fetchLastClosePrices() {
  return function(dispatch) {
    dispatch( {type: 'LOADING_PRICES'} )
    return fetch('/api/daily_trades/last_close?symbols=aapl')
      .then(res => {return res.json()})
      .then(responseJson => {dispatch( {type: 'FETCH_LAST_CLOSE_PRICES', payload: responseJson} )});
  }
}
