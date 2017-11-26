import Portfolio from '../classes/Portfolio';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';
import * as Request from '../utils/request.js';

// Create a new portfolio.
export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.addPortfolio(dispatch, portfolio);
  }
}

// Delete a portfolio.
export function deletePortfolio(portfolioId) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.deletePortfolio(dispatch, portfolioId);
  }
}

// Load all portfolios from server.
export function loadPortfolios(loadLivePrices, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.loadPortfolios(dispatch, loadLivePrices, sortFn);
  }
}

// Process a click on the portfolios table column header.
export function sortPortfolios(portfolios, property, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    sortFn(portfolios, Portfolio.sort, property);
    return (dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios: portfolios)));
  }
}

// Update an existing portfolio.
export function updatePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.updatePortfolio(dispatch, portfolio);
  }
}
