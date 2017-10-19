import fetch from 'isomorphic-fetch';
import Fetch from '../utils/fetch';
import {portfolioActions} from '../reducers/portfolios_reducer';

const GUEST_USER_ID = 1;

function addPortfolioAction(payload)    {return {type: portfolioActions.ADD_PORTFOLIO,     payload: payload};}
function deletePortfolioAction(payload) {return {type: portfolioActions.DELETE_PORTFOLIO,  payload: payload};}
function errorPortfolioAction(payload)  {return {type: portfolioActions.ERROR_PORTFOLIOS,  payload: payload};}
function loadPortfoliosAction(payload)  {return {type: portfolioActions.LOAD_PORTFOLIOS,   payload: payload};}
function sortPortfoliosAction(payload)  {return {type: portfolioActions.SORT_PORTFOLIOS,   payload: payload};}
function updatePortfolioAction(payload) {return {type: portfolioActions.UPDATE_PORTFOLIOS, payload: payload};}
function updatingPortfolioAction()      {return {type: portfolioActions.UPDATING_PORTFOLIO};}

export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch('/api/portfolios/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: GUEST_USER_ID,
          name: portfolio.name,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(addPortfolioAction(responseJson));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Add Portfolio Error: ', error: error})))
    );
  }
}

export function deletePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'DELETE',
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(deletePortfolioAction(portfolio));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Delete Portfolio Error: ', error: error})))
    );
  }
}

export function loadPortfolios() {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch('/api/portfolios')
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.length) {
          throw responseJson;
        }
        responseJson.forEach(function(portfolio) {
          portfolio['gainLoss'] = portfolio.marketValue - portfolio.totalCost;
          portfolio.open_positions.forEach(function(position) {
            position['marketValue'] = position.quantity * position.lastClosePrice;
            position['gainLoss']    = position.marketValue - position.cost;
          });
        });
        dispatch(loadPortfoliosAction(responseJson));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Load Portfolios Error: ', error: error})))
    );
  }
}

export function sortPortfolios(columnName, reverseSort) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
        dispatch(sortPortfoliosAction({columnName, reverseSort}))
    );
  }
}

export function updatePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: portfolio.name,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(updatePortfolioAction(responseJson));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Update Portfolio Error: ', error: error})))
    );
  }
}
