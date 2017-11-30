import fetch from 'isomorphic-fetch';
import Fmt from '../utils/formatter';
import Portfolio from '../classes/Portfolio';
import * as PortfolioReducer from '../reducers/portfolios_reducer';
import * as UserReducer from '../reducers/users_reducer';

// Add a new portfolio.
export function portfolioAdd(dispatch, portfolio) {
  fetch('/api/portfolios/', {
    method:  'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body:    JSON.stringify({name: portfolio.name}),
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(loadedPortfolio => {
    if (!loadedPortfolio.id) {
      throw new Error('Portfolio add failed!');
    }
    const portfolio = new Portfolio(loadedPortfolio.id, loadedPortfolio.name);
    dispatch(PortfolioReducer.addPortfolio(portfolio));
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Add Portfolio: ', error: error.message})))
}

// Delete a portfolio.
export function portfolioDelete(dispatch, portfolioId) {
  fetch(`/api/portfolios/${portfolioId}`, {
    method:  'DELETE',
    headers: {'Accept': 'application/json'},
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(deletedPortfolio => {
    if (!deletedPortfolio.id) {
      throw new Error('Portfolio delete failed!');
    }
    dispatch(PortfolioReducer.deletePortfolio(portfolioId));
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Delete Portfolio: ', error: error.message})))
}

// Update an existing portfolio.
export function portfolioUpdate(dispatch, portfolio) {
  fetch(`/api/portfolios/${portfolio.id}`, {
    method:  'PATCH',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body:    JSON.stringify({name: portfolio.name}),
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(updatedPortfolio => {
    if (!updatedPortfolio.id) {
      throw new Error('Portfolio update failed!');
    }
    portfolio.name = updatedPortfolio.name  // The returned portfolio does not have any of the calculated pricing information.
    dispatch(PortfolioReducer.updatePortfolio(portfolio));
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Update Portfolio: ', error: error.message})))
}

// Load all portfolios from server.
export function portfoliosLoad(dispatch, loadLivePrices, sortFn) {
  fetch('/api/portfolios', {
    headers: {'Accept': 'application/json'},
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(loadedPortfolios => {
    const portfolios = loadedPortfolios.map(loadedPortfolio => {
      const portfolio = new Portfolio(loadedPortfolio.id, loadedPortfolio.name, loadedPortfolio.positions);
      return portfolio;
    });
    const livePrices = (loadLivePrices === true) ? 'livePrices' : '';
    fetch(`/api/portfolios/last-price?${livePrices}`, {
      headers: {'Accept': 'application/json'},
    })
    .then(statusCheck)
    .then(response => response.json())
    .then(trades => {
      if ('error' in trades) {
        dispatch(PortfolioReducer.errorPortfolio({prefix: 'Load Portfolios: ', error: trades}));
      } else {
        trades.forEach(trade => {    // Validate trade data.
          if (trade.error !== null) {
            dispatch(PortfolioReducer.warnPortfolio({prefix: 'Load Portfolios Prices for ', warning: trade.error}));
          }
        });
        Portfolio.applyPrices(portfolios, trades);
        sortFn(portfolios, Portfolio.sort);
        dispatch(PortfolioReducer.updateAllPortfolio(portfolios));
      }
    })
    .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Load Portfolios: ', error: error.message})))
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Load Portfolios: ', error: error.message})))
}

// Create a new position.
export function positionAdd(dispatch, position, sortFn) {
  fetch(`/api/portfolios/${position.portfolio_id}/positions`, {
    method:  'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body:    JSON.stringify({instrument_symbol: position.instrument_symbol, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired}),
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(updatedPortfolio => {
    if (!updatedPortfolio.id) {
      throw new Error(`Position add failed! ${updatedPortfolio[0]}.`);
    }
    portfoliosLoad(dispatch, false, sortFn);
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Add Position: ', error: error.message})))
}

// Delete a position.
export function positionDelete(dispatch, portfolioId, positionId, sortFn) {
  fetch(`/api/portfolios/${portfolioId}/positions/${positionId}`, {
    method:  'DELETE',
    headers: {'Accept': 'application/json'},
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(updatedPortfolio => {
    if (!updatedPortfolio.id) {
      throw new Error(`Position delete failed! ${updatedPortfolio[0]}.`);
    }
    portfoliosLoad(dispatch, false, sortFn);
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Delete Position: ', error: error.message})))
}

// Update an existing position.
export function positionUpdate(dispatch, position, sortFn) {
  fetch(`/api/portfolios/${position.portfolio_id}/positions/${position.id}`, {
    method:  'PATCH',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body:    JSON.stringify({instrument_symbol: position.instrument_symbol, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired}),
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(updatedPortfolio => {
    if (!updatedPortfolio.id) {
      throw new Error(`Position update failed! ${updatedPortfolio[0]}.`);
    }
    portfoliosLoad(dispatch, false, sortFn);
  })
  .catch(error => dispatch(PortfolioReducer.errorPortfolio({prefix: 'Update Position: ', error: error.message})))
}

// Request the server to refresh trade prices.
export function pricesRefresh() {
  fetch('/api/trades/refresh', {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .catch(error => {alert(Fmt.serverError('Refresh Prices', error));});
}

// Check a fetch response status.
function statusCheck(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.log(error);
  }
  return response;
}

// Retrieve User.
export function userFetch(dispatch, userId) {
  return fetch(`/api/users/${userId}`, {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .then(response => response.json())
  .then(user => {
    dispatch(UserReducer.updateUser(user));
  })
  .catch(error => dispatch(UserReducer.errorUser({prefix: 'User Fetch: ', error: error.message})))
}

// Update an existing User.
export function userSave(dispatch, user) {
  fetch(`/api/users/${user.id}`, {
    method:  'PATCH',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body:    JSON.stringify({locale: user.locale}),
  })
  .then(statusCheck)
  .then(response => response.json())
  .then(updatedUser => {
    if (!updatedUser.id) {
      throw new Error('User update failed!');
    }
    dispatch(UserReducer.updateUser(user));
  })
  .catch(error => {alert(error.message)});
}