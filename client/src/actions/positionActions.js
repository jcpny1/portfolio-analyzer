import fetch from 'isomorphic-fetch';
import * as Actions from '../utils/actions';
import Portfolio from '../containers/classes/Portfolio';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';
import {loadPortfolios} from './portfolioActions';

export function addPosition(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${position.portfolio_id}/positions`, {
        method:  'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:    JSON.stringify({stock_symbol_name: position.stock_symbol_name, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired}),
      })
      .then(Actions.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position add failed! ${updatedPortfolio[0]}.`);
        }
        var reloadPortfolios = loadPortfolios(false, sortFn);
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Position: ', error: error.message})))
    );
  }
}

export function deletePosition(portfolioId, positionId, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
        method:  'DELETE',
        headers: {'Accept': 'application/json'},
      })
      .then(Actions.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position delete failed! ${updatedPortfolio[0]}.`);
        }
        var reloadPortfolios = loadPortfolios(false, sortFn);
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Position: ', error: error.message})))
    );
  }
}

// Process click on positions table column header.
export function sortPositions(portfolios, property, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    sortFn(portfolios, Portfolio.sort, null, property);
    return (dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios: portfolios)));
  }
}

export function updatePosition(position, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${position.portfolio_id}/positions/${position.id}`, {
        method:  'PATCH',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:    JSON.stringify({stock_symbol_name: position.stock_symbol_name, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired}),
      })
      .then(Actions.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position update failed! ${updatedPortfolio[0]}.`);
        }
        var reloadPortfolios = loadPortfolios(false, sortFn);
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position: ', error: error.message})))
    );
  }
}
