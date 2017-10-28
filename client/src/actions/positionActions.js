import fetch from 'isomorphic-fetch';
import ActionUtils from './actionUtils';
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
          stock_symbol_name: openPosition.stock_symbol_name,
          quantity:          openPosition.quantity,
          cost:              openPosition.cost,
          date_acquired:     openPosition.date_acquired,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw updatedPortfolio;
        }
        dispatch(PortfolioReducerFunctions.updatePortfolioAction(updatedPortfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Position: ', error: error})))
    );
  }
}

export function deletePosition(portfolioId, openPositionId) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}/open_positions/${openPositionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw updatedPortfolio;
        }
        dispatch(PortfolioReducerFunctions.updatePortfolioAction(updatedPortfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Position: ', error: error})))
    );
  }
}

export function sortPositions(portfolio, columnName, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    switch (columnName) {
      case 'stock_symbol':
        portfolio.open_positions.sort(ActionUtils.sort_by('stock_symbol', reverseSort, function(a){return a.name}));
        break;
      case 'date_acquired': // fall through
      case 'lastTradeDate':
        portfolio.open_positions.sort(ActionUtils.sort_by(columnName, reverseSort));
        break;
      case 'cost':           // fall through
      case 'gainLoss':       // fall through
      case 'lastClosePrice': // fall through
      case 'marketValue':    // fall through
      case 'quantity':
        portfolio.open_positions.sort(ActionUtils.sort_by(columnName, reverseSort, parseFloat));
        break;
      default:
        portfolio.open_positions.sort(ActionUtils.sort_by(columnName, reverseSort));
        break;
    }
    return (dispatch(PortfolioReducerFunctions.updatePortfolioAction(portfolio)));
  }
}

export function updatePosition(openPosition) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${openPosition.portfolio_id}/open_positions/${openPosition.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_name: openPosition.stock_symbol_name,
          quantity:          openPosition.quantity,
          cost:              openPosition.cost,
          date_acquired:     openPosition.date_acquired,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw updatedPortfolio;
        }
        dispatch(PortfolioReducerFunctions.updatePortfolioAction(updatedPortfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position: ', error: error})))
    );
  }
}
