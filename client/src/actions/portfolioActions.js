import fetch from 'isomorphic-fetch';
import Api from '../utils/apis';

const GUEST_USER_ID = 1;

export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch({type: 'UPDATING_PORTFOLIO'})
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
    .then(Api.checkStatus)
    .then(response => response.json())
    .then(responseJson => {
      dispatch({type: 'ADD_PORTFOLIO', payload: responseJson});
    });
  }
}

export function deletePortfolio(portfolio) {
  return function(dispatch) {
    dispatch({type: 'UPDATING_PORTFOLIO'})
    return fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'DELETE',
    })
    .then(Api.checkStatus)
    .then(response => response.json())
    .then(responseJson => { dispatch({type: 'DELETE_PORTFOLIO', payload: portfolio}); });
  }
}

export function fetchPortfolios() {
  return function(dispatch) {
    dispatch({type: 'UPDATING_PORTFOLIO'})
    return fetch('/api/portfolios')
    .then(Api.checkStatus)
    .then(response => response.json())
    .then(responseJson => {dispatch({type: 'LOAD_PORTFOLIOS', payload: responseJson}) });
  }
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
    .then(Api.checkStatus)
    .then(response => response.json())
    .then(responseJson => {
      dispatch({type: 'UPDATE_PORTFOLIO', payload: responseJson});
    });
  }
}
