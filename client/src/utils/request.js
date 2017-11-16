import Fmt from '../utils/formatter';
import Portfolio from '../containers/classes/Portfolio';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';

// Add a new portfolio.
export function addPortfolio(dispatch, portfolio) {
  return (
    fetch('/api/portfolios/', {
      method:  'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body:    JSON.stringify({user_id: portfolio.user_id, name: portfolio.name}),
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(newPortfolio => {
      if (!newPortfolio.id) {
        throw new Error('Portfolio add failed!');
      }
      Portfolio.initPositionValues([newPortfolio]);
      dispatch(PortfolioReducerFunctions.addPortfolioAction(newPortfolio));
    })
    .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Portfolio: ', error: error.message})))
  );
}

// Create a new position.
export function addPosition(dispatch, position, sortFn) {
  return function(dispatch) {
    return (
      fetch(`/api/portfolios/${position.portfolio_id}/positions`, {
        method:  'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:    JSON.stringify({instrument_symbol: position.instrument_symbol, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired}),
      })
      .then(checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw new Error(`Position add failed! ${updatedPortfolio[0]}.`);
        }
        loadPortfolios(dispatch, false, sortFn);
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Position: ', error: error.message})))
    );
  }
}

// Check a fetch response status.
function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.log(error);
  }
  return response;
}

// Delete a portfolio.
export function deletePortfolio(dispatch, portfolioId) {
  return (
    fetch(`/api/portfolios/${portfolioId}`, {
      method:  'DELETE',
      headers: {'Accept': 'application/json'},
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(deletedPortfolio => {
      if (!deletedPortfolio.id) {
        throw new Error('Portfolio delete failed!');
      }
      dispatch(PortfolioReducerFunctions.deletePortfolioAction(portfolioId));
    })
    .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Portfolio: ', error: error.message})))
  );
}

// Delete a position.
export function deletePosition(dispatch, portfolioId, positionId, sortFn) {
  return (
    fetch(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
      method:  'DELETE',
      headers: {'Accept': 'application/json'},
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(updatedPortfolio => {
      if (!updatedPortfolio.id) {
        throw new Error(`Position delete failed! ${updatedPortfolio[0]}.`);
      }
      loadPortfolios(dispatch, false, sortFn);
    })
    .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Position: ', error: error.message})))
  );
}

// Lookup instrument by value.
// params={field, value, exact}
// Specify option 'exact' as true (for an exact match) or false (for a partial match).
export function instrumentSearch(params, cb) {
  const exact = params.exact ? '&exact' : '';
  return fetch(`/api/instruments?v=${encodeURI(params.value)}${exact}`, {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(error.message)});
}

// Load all portfolios from server.
export function loadPortfolios(dispatch, loadLivePrices, sortFn) {
  return (
    fetch('/api/portfolios', {
      headers: {'Accept': 'application/json'},
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(portfolios => {
      Portfolio.initPositionValues(portfolios)
      const livePrices = (loadLivePrices === true) ? 'livePrices&' : '';
      const userId = (portfolios.length > 0) ? portfolios[0].user.id : '';
      fetch(`/api/portfolios/last-price?${livePrices}userId=${userId}`, {
        headers: {'Accept': 'application/json'},
      })
      .then(checkStatus)
      .then(response => response.json())
      .then(trades => {
        if ('error' in trades) {
          dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: trades}));
        } else {
          trades.forEach(trade => {    // Validate trade data.
            if (trade.error !== null) {
              dispatch(PortfolioReducerFunctions.warnPortfolioAction({prefix: 'Load Portfolios Prices for ', warning: trade.error}));
            }
          });
          Portfolio.processPrices(portfolios, trades);
          sortFn(portfolios, Portfolio.sort);
          dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios));
        }
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: error.message})))
    })
    .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: error.message})))
  );
}

// Request the server to refresh the symbololgy database.
export function refreshHeadlines(cb) {
  fetch('/api/headlines', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Headlines: '));});
}

// Request the server to refresh market indexes.
export function refreshIndexes(cb) {
  fetch('/api/last-index?symbols=DJIA', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Indexes: '));});
}

// Request the server to refresh the symbololgy database.
export function refreshInstruments() {
  fetch('/api/instruments/refresh', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Symbols: '));});
}

// Request the server to refresh trade prices.
export function refreshPrices() {
  fetch('/api/trades/refresh', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Prices: '));});
}

// Update an existing portfolio.
export function updatePortfolio(dispatch, portfolio) {
  return (
    fetch(`/api/portfolios/${portfolio.id}`, {
      method:  'PATCH',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body:    JSON.stringify({name: portfolio.name,}),
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(updatedPortfolio => {
      if (!updatedPortfolio.id) {
        throw new Error('Portfolio update failed!');
      }
      dispatch(PortfolioReducerFunctions.updatePortfolioAction(updatedPortfolio));
    })
    .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Portfolio: ', error: error.message})))
  );
}

// Update an existing position.
export function updatePosition(dispatch, position, sortFn) {
  return (
    fetch(`/api/portfolios/${position.portfolio_id}/positions/${position.id}`, {
      method:  'PATCH',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body:    JSON.stringify({instrument_symbol: position.instrument_symbol, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired}),
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(updatedPortfolio => {
      if (!updatedPortfolio.id) {
        throw new Error(`Position update failed! ${updatedPortfolio[0]}.`);
      }
      loadPortfolios(dispatch, false, sortFn);
    })
    .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Position: ', error: error.message})))
  );
}
