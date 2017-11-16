import Portfolio from '../containers/classes/Portfolio';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';
import * as Request from '../utils/request.js';

// Create a new position.
export function addPosition(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.addPosition(dispatch, position, sortFn);
  }
}

// Delete a position.
export function deletePosition(portfolioId, positionId, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.deletePosition(dispatch, portfolioId, positionId, sortFn);
  }
}

// Process a click on the positions table column header.
export function sortPositions(portfolios, property, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    sortFn(portfolios, Portfolio.sort, null, property);
    return (dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios: portfolios)));
  }
}

// Update an existing position.
export function updatePosition(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    Request.updatePosition(dispatch, position, sortFn);
  }
}
