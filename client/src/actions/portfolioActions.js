import Portfolio from '../classes/Portfolio';
import * as PortfolioReducer from '../reducers/portfolioReducer';
import * as Request from './actionRequests.js';

// Create a new portfolio.
export function portfolioAdd(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    Request.portfolioAdd(dispatch, portfolio);
  }
}

// Delete a portfolio.
export function portfolioDelete(portfolioId) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    Request.portfolioDelete(dispatch, portfolioId);
  }
}

// Load all portfolios from server.
export function portfoliosLoad(loadLivePrices, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    Request.portfoliosLoad(dispatch, loadLivePrices, sortFn);
  }
}

// Process a click on the portfolios table column header.
export function portfoliosSort(portfolios, property, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    sortFn(portfolios, Portfolio.sort, property);
    return (dispatch(PortfolioReducer.updateAllPortfolio(portfolios)));
  }
}

// Update an existing portfolio.
export function portfolioUpdate(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    Request.portfolioUpdate(dispatch, portfolio);
  }
}
