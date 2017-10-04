import fetch from 'isomorphic-fetch';

export function fetchPositions(portfolio_id) {
  return function(dispatch) {
    dispatch( {type: 'LOADING_POSITIONS'} )
    return fetch('/api/portfolios/' + portfolio_id)
      .then(res => {return res.json()})
      .then(responseJson => {
        dispatch( {type: 'FETCH_POSITIONS', payload: responseJson} );
        fetchLastClosePrices(dispatch, responseJson.open_positions);
      });
  }
}

// .then(Client.checkStatus)
// .then(Client.parseJSON)

export function fetchLastClosePrices(dispatch, open_positions) {
  let symbols = open_positions.map( function(open_position) { return open_position.stock_symbol.name });
  fetch('/api/daily_trades/last_close?symbols=' + symbols.toString())
    .then(res => {return res.json()})
    .then(responseJson => {dispatch( {type: 'FETCH_LAST_CLOSE_PRICES', payload: responseJson} )});
}
