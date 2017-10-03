import fetch from 'isomorphic-fetch';

export function fetchPositions() {
  return function(dispatch) {
    dispatch( {type: 'LOADING_POSITIONS'} )
    return fetch('api/positions')
      .then(res => {return res.json()})
      .then(responseJson => {dispatch( {type: 'FETCH_POSITIONS', payload: responseJson} )});
  }
}

// .then(Client.checkStatus)
// .then(Client.parseJSON)
