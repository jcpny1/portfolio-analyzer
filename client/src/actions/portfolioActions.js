import fetch from 'isomorphic-fetch';

const GUEST_USER_ID = 1;

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

export function deletePortfolio(portfolio, index) {
  return function(dispatch) {
    dispatch({type: 'DELETING_PORTFOLIO'})
    return fetch('/api/portfolios/'+portfolio.id, {
      method: 'DELETE',
      headers: {
        'Accept'      : 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => { dispatch({type: 'DELETE_PORTFOLIO', payload: index}); });
  }
}

export function fetchPortfolios() {
  return function(dispatch) {
    dispatch( {type: 'LOADING_PORTFOLIOS'} )
    return fetch('/api/portfolios')
      .then(res => {return res.json()})
      .then(responseJson => {dispatch( {type: 'LOAD_PORTFOLIOS', payload: responseJson} )});
  }
}

export function updatePortfolio(portfolio) {
  return function(dispatch) {
    if (portfolio.id === '') {
      dispatch({type: 'CREATING_PORTFOLIO'})
      return fetch('/api/portfolios/', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              user_id: GUEST_USER_ID,
              name: portfolio.name,
          })
      })
      .then(checkStatus)
      .then(parseJSON)
      .then(responseJson => {
        dispatch({type: 'CREATE_PORTFOLIO', payload: {portfolio: responseJson}});
      });
    } else {
      dispatch({type: 'UPDATING_PORTFOLIO'})
      return fetch('/api/portfolios/'+portfolio.id, {
          method: 'PATCH',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: portfolio.name,
          })
      })
      .then(checkStatus)
      .then(parseJSON)
      .then(responseJson => {
        dispatch({type: 'UPDATE_PORTFOLIO', payload: {index: portfolio.index, portfolio: responseJson}});
      });
    }
  }
}
