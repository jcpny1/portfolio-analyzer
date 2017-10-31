import fetch from 'isomorphic-fetch';
import ActionUtils from './actionUtils';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';
import {loadPortfolios} from './portfolioActions';

export function addPosition(position) {
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
        var reloadPortfolios = loadPortfolios();
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Position: ', error: error.message})))
    );
  }
}

export function deletePosition(portfolioId, positionId) {
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
        var reloadPortfolios = loadPortfolios();
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Position: ', error: error.message})))
    );
  }
}

export function sortPositions(portfolio, columnName, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    switch (columnName) {
      case 'stock_symbol':
        portfolio.positions.sort(ActionUtils.sort_by('stock_symbol', reverseSort, function(a){return a.name}));
        break;
      case 'date_acquired': // fall through
      case 'lastTradeDate':
        portfolio.positions.sort(ActionUtils.sort_by(columnName, reverseSort));
        break;
      case 'cost':        // fall through
      case 'dayChange':   // fall through
      case 'gainLoss':    // fall through
      case 'lastTrade':   // fall through
      case 'marketValue': // fall through
      case 'priceChange': // fall through
      case 'quantity':
        portfolio.positions.sort(ActionUtils.sort_by(columnName, reverseSort, parseFloat));
        break;
      default:
        portfolio.positions.sort(ActionUtils.sort_by(columnName, reverseSort));
        break;
    }
    return (dispatch(PortfolioReducerFunctions.updatePortfolioAction(portfolio)));
  }
}

export function updatePosition(position) {
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
        var reloadPortfolios = loadPortfolios();
        reloadPortfolios(dispatch);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position: ', error: error.message})))
    );
  }
}
