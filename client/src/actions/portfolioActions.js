import fetch from 'isomorphic-fetch';
import ActionUtils from './actionUtils';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';

const GUEST_USER_ID = 1;

export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch('/api/portfolios/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: GUEST_USER_ID,
          name: portfolio.name,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(newPortfolio => {
        if (!newPortfolio.id) {
          throw new Error('Portfolio add failed!');
        }
        ActionUtils.initPortfolioPositionValues([newPortfolio]);
        dispatch(PortfolioReducerFunctions.addPortfolioAction(newPortfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Portfolio: ', error: error.message})))
    );
  }
}

export function deletePortfolio(portfolioId) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
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
}

export function loadPortfolios(loadLivePrices, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch('/api/portfolios', {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(portfolios => {
        ActionUtils.initPortfolioPositionValues(portfolios)
        const livePrices = (loadLivePrices === true) ? 'livePrices&' : '';
        const userId = (portfolios.length > 0) ? portfolios[0].user.id : '';
        fetch(`/api/portfolios/latestPrices?${livePrices}userId=${userId}`, {
          headers: {
            'Accept': 'application/json',
          },
        })
        .then(ActionUtils.checkStatus)
        .then(response => response.json())
        .then(trades => {
          // Validate trade data.
          trades.forEach(function(trade) {
            if (trade.error !== null) {
              dispatch(PortfolioReducerFunctions.warnPortfolioAction({prefix: 'Load Prices for ', warning: trade.error}));
            }
          });
          ActionUtils.processPrices(portfolios, trades);
          sortFn(portfolios);
          dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios));
        })
        .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: error.message})))
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: error.message})))
    );
  }
}

// Process click on portfolios table column header.
export function sortPortfolios(portfolios, property, sortFn) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    sortFn(portfolios, property);
    return (dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios: portfolios)));
  }
}

export function updatePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: portfolio.name,
        }),
      })
      .then(ActionUtils.checkStatus)
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
}
