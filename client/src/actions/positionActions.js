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
          stock_symbol_id: openPosition.stock_symbol_id,
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

// TODO Also in portfolioActions. move this to a utils file. Maybe within the actions folder.
// A generic sort comparator function.
var sort_by = function(field, reverse = false, compareFn) {
  var key = function (x) {return compareFn ? compareFn(x[field]) : x[field]};
  return function (a,b) {
    var A = key(a), B = key(b);
    return ( ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [1,-1][+!!reverse] );
  }
}

export function sortPositions(portfolio, columnName, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    switch (columnName) {
      case 'stock_symbol':
        portfolio.open_positions.sort(sort_by('stock_symbol', reverseSort, function(a){return a.name.toUpperCase()}));
        break;
      case 'date_acquired':
        portfolio.open_positions.sort(sort_by(columnName, reverseSort, parseInt));
        break;
      case 'cost':           // fall through
      case 'gainLoss':       // fall through
      case 'lastClosePrice': // fall through
      case 'marketValue':    // fall through
      case 'quantity':
        portfolio.open_positions.sort(sort_by(columnName, reverseSort, parseFloat));
        break;
      default:
        portfolio.open_positions.sort(sort_by(columnName, reverseSort));
        break;
    }
    return (dispatch(PortfolioReducerFunctions.updatePortfolioAction(portfolio)));
  }
}



// TODO this belongs to portfolio actions and is duplicate code.
function recomputePositionSummary(position, closePrice) {
  position.lastClosePrice = closePrice;
  position.marketValue    = position.quantity * position.lastClosePrice;
  position.gainLoss       = position.marketValue - position.cost;
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
          stock_symbol_id: open_position.stock_symbol_id,
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
        recomputePositionSummary(newPosition, open_position.lastClosePrice);
        dispatch(PortfolioReducerFunctions.updatePositionAction(newPosition));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position Error: ', error: error})))
    );
  }
}
