import Portfolio from '../classes/Portfolio';
import * as PortfolioReducer from '../reducers/portfolioReducer';
import * as FetchAction from './fetchActions';

// Create a new position.
export function positionAdd(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    FetchAction.positionAdd(dispatch, position, sortFn);
  }
}

// Delete a position.
export function positionDelete(portfolioId, positionId, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducer.updatingPortfolio());
    FetchAction.positionDelete(dispatch, portfolioId, positionId, sortFn);
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
    FetchAction.positionUpdate(dispatch, position, sortFn);
  }
}
