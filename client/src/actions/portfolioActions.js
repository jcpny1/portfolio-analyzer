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

export function loadPortfolios(loadLivePrices) {
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
        if (!portfolios.length) {
          throw new Error('No portfolios were found.');
        }
        ActionUtils.initPortfolioPositionValues(portfolios)
        const livePrices = (loadLivePrices === true) ? 'livePrices&' : '';
        fetch(`/api/portfolios/latestPrices?${livePrices}userId=${portfolios[0].user.id}`, {
          headers: {
            'Accept': 'application/json',
          },
        })
        .then(ActionUtils.checkStatus)
        .then(response => response.json())
        .then(trades => {
          if (!trades.length) {
            throw new Error('No prices were found for positions.');
          }
          // Validate trade data.
          trades.forEach(function(trade) {
            if (trade.error !== null) {
              dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: trade.error}));
            }
          });
          portfolios.forEach(function(portfolio) {ActionUtils.processPrices(portfolio, trades)});
// sortFn(portfolios);
          dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios));
        });
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: error.message})))
    );
  }
}

export function sortPortfolios(portfolios, property, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    var arraySort = ActionUtils.sortArray('Portfolio.'+property, property, reverseSort);
    arraySort(portfolios);
    return (dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios)));
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
