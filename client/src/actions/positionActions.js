import fetch from 'isomorphic-fetch';
import Fetch from '../utils/fetch';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';

export function addPosition(openPosition) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${openPosition.portfolio_id}/open_positions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_id: openPosition.stock_symbol.id,
          quantity:        openPosition.quantity,
          cost:            openPosition.cost,
          date_acquired:   openPosition.date_acquired,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(newPosition => {
        if (!newPosition.id) {
          throw newPosition;
        }
        dispatch(PortfolioReducerFunctions.addPositionAction(newPosition));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Position Error: ', error: error})))
    );
  }
}

export function deletePosition(open_position) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${open_position.portfolio_id}/open_positions/${open_position.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(PortfolioReducerFunctions.deletePositionAction(responseJson));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Position Error: ', error: error})))
    );
  }
}

export function sortPositions(portfolio_id, columnName, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
        dispatch(PortfolioReducerFunctions.sortPositionsAction({portfolio_id, columnName, reverseSort}))
    );
  }
}

export function updatePosition(open_position) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${open_position.portfolio_id}/open_positions/${open_position.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_id: open_position.stock_symbol.id,
          quantity:        open_position.quantity,
          cost:            open_position.cost,
          date_acquired:   open_position.date_acquired,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(newPosition => {
        if (!newPosition.id) {
          throw newPosition;
        }
        dispatch(PortfolioReducerFunctions.updatePositionAction(newPosition));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position Error: ', error: error})))
    );
  }
}
