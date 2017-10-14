import fetch from 'isomorphic-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error);
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export function deletePosition(open_position) {
  return function(dispatch) {
    dispatch({type: 'DELETING_POSITION'})
    return fetch('/api/portfolios/' + open_position.portfolio_id + '/open_positions/' + open_position.id, {
      method: 'DELETE',
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => { dispatch({type: 'DELETE_POSITION', payload: open_position}); });
  }
}

export function fetchLastClosePrices(positions) {
  let symbols = positions.map( function(position) {return position.stock_symbol.name});
  if (symbols.length > 0) {
    return function(dispatch) {
      fetch('/api/daily_trades/last_close?symbols=' + symbols.toString())
      .then(checkStatus)
      .then(parseJSON)
      .then(responseJson => {dispatch( {type: 'LOAD_LAST_CLOSE_PRICES', payload: responseJson} )});
    }
  }
}

export function fetchPositions(portfolio_id) {
  return function(dispatch) {
    dispatch({type: 'LOADING_POSITIONS', payload: portfolio_id})
    return fetch('/api/portfolios/' + portfolio_id)
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {
      dispatch({type: 'LOAD_POSITIONS', payload: responseJson});
      fetchLastClosePrices(dispatch, responseJson.open_positions);
    });
  }
}

export function fetchSymbols() {
  return function(dispatch) {
    dispatch({type: 'LOADING_STOCK_SYMBOLS', payload: ''})
    return fetch('/api/stock_symbols')
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {dispatch( {type: 'LOAD_STOCK_SYMBOLS', payload: responseJson} )});
  }
}

export function updatePosition(open_position) {
  return function(dispatch) {
    dispatch({type: 'UPDATING_POSITION'})
    return fetch('/api/portfolios/' + open_position.portfolio_id + '/open_positions/' + open_position.id, {
      method: 'PATCH',
      headers: {
        'Accept'      : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_symbol_id: open_position.stock_symbol_id,
        quantity: open_position.quantity,
        cost: open_position.cost,
        date_acquired: open_position.date_acquired,
      }),
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {
      dispatch({type: 'UPDATE_POSITION', payload: responseJson});
    });
  }
}
