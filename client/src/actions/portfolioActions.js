import fetch from 'isomorphic-fetch';

export function fetchPortfolios() {
  return function(dispatch) {
    dispatch( {type: 'LOADING_PORTFOLIOS'} )
    return fetch('api/portfolios')
      .then(res => {return res.json()})
      .then(responseJson => {dispatch( {type: 'FETCH_PORTFOLIOS', payload: responseJson} )});
  }
}

// .then(Client.checkStatus)
// .then(Client.parseJSON)
