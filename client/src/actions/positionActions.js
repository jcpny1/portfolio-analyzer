import Portfolio from '../classes/Portfolio';
import * as PortfolioReducer from '../reducers/portfolioReducer';
import * as ActionRequest from './actionRequests';

// Create a new position.
export function positionAdd(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    ActionRequest.positionAdd(dispatch, position, sortFn);
  }
}

// Delete a position.
export function positionDelete(portfolioId, positionId, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    ActionRequest.positionDelete(dispatch, portfolioId, positionId, sortFn);
  }
}

// Process a click on the positions table column header.
export function positionsSort(portfolios, property, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    sortFn(portfolios, Portfolio.sort, null, property);
    return (dispatch(PortfolioReducer.updateAllPortfolio(portfolios)));
  }
}

// Update an existing position.
export function positionUpdate(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    ActionRequest.positionUpdate(dispatch, position, sortFn);
  }
}
