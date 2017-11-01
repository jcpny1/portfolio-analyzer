import fetch from 'isomorphic-fetch';
import ActionUtils from './actionUtils';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';
import {loadPortfolios} from './portfolioActions';

export function addPosition(position, sorting) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${position.portfolio_id}/positions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_name: position.stock_symbol_name,
          quantity:          position.quantity,
          cost:              position.cost,
          date_acquired:     position.date_acquired,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position add failed! ${updatedPortfolio[0]}.`);
        }
        var reloadPortfolios = loadPortfolios(true, sorting);
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Position: ', error: error.message})))
    );
  }
}

export function deletePosition(portfolioId, positionId, sorting) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position delete failed! ${updatedPortfolio[0]}.`);
        }
        var reloadPortfolios = loadPortfolios(true, sorting);
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Position: ', error: error.message})))
    );
  }
}

// Process click on positions table column header.
export function sortPositions(portfolios, property, sorting) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    const newColDirection = sorting.positions.sortFn(property);
    const newSorting = Object.assign({}, sorting, {positions: {sortFn: sorting.positions.sortFn, colName: property, colDirection: newColDirection}});
    ActionUtils.sortPortfolios(portfolios, newSorting);
    return (dispatch(PortfolioReducerFunctions.sortPortfoliosAction({portfolios: portfolios, sorting: newSorting})));
  }
}

export function updatePosition(position, sorting) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${position.portfolio_id}/positions/${position.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_name: position.stock_symbol_name,
          quantity:          position.quantity,
          cost:              position.cost,
          date_acquired:     position.date_acquired,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position update failed! ${updatedPortfolio[0]}.`);
        }
        var reloadPortfolios = loadPortfolios(true, sorting);
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position: ', error: error.message})))
    );
  }
}
