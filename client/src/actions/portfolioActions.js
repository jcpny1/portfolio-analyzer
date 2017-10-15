import fetch from 'isomorphic-fetch';

const GUEST_USER_ID = 1;

export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch({type: 'ADDING_PORTFOLIO'})
    return fetch('/api/portfolios/', {
        method: 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: GUEST_USER_ID,
            name: portfolio.name,
        }),
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {
      dispatch({type: 'ADD_PORTFOLIO', payload: responseJson});
    });
  }
}

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

export function deletePortfolio(portfolio) {
  return function(dispatch) {
    dispatch({type: 'DELETING_PORTFOLIO'})
    return fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'DELETE',
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => { dispatch({type: 'DELETE_PORTFOLIO', payload: portfolio}); });
  }
}

export function fetchPortfolios() {
  return function(dispatch) {
    dispatch({type: 'LOADING_PORTFOLIOS'})
    return fetch('/api/portfolios')
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {dispatch({type: 'LOAD_PORTFOLIOS', payload: responseJson}) });
  }
}

function parseJSON(response) {
  return response.json();
}

export function updatePortfolio(portfolio) {
  return function(dispatch) {
    dispatch({type: 'UPDATING_PORTFOLIO'})
    return fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'PATCH',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: portfolio.name,
        }),
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {
      dispatch({type: 'UPDATE_PORTFOLIO', payload: responseJson});
    });
  }
}
