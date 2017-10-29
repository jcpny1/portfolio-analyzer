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

// Initialize a portfolio's summary values. Return an array of stock symbols contained in the portfolio.
function initPortfolioSummaryValues(portfolio) {
  let symbols = [];
  portfolio.open_positions.forEach(function(position) {
    position.lastClosePrice = 0.0;
    position.marketValue    = 0.0;
    position.gainLoss       = 0.0;
    const symbolName = position.stock_symbol.name;
    if (symbols.indexOf(symbolName) === -1) {
      symbols.push(symbolName);
    }
  });
  return symbols;
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
        let symbols = [];
        portfolios.forEach(function(portfolio) {
          symbols.push(...initPortfolioSummaryValues(portfolio));
        });

        if (symbols.length > 0) {
          const livePrices = (loadLivePrices === true) ? 'livePrices&' : '';
          fetch(`/api/daily_trades/latestPrices?${livePrices}symbols=${symbols.toString()}`, {
            headers: {
              'Accept': 'application/json',
            },
          })
          .then(ActionUtils.checkStatus)
          .then(response => response.json())
          .then(dailyTrades => {
            if (!dailyTrades.length) {
              throw new Error('No prices were found for positions.');
            }
            // Validate dailyTrade data.
            dailyTrades.forEach(function(dailyTrade) {
              if ('error' in dailyTrade)
                dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: dailyTrade.error}));
            });
            portfolios.forEach(function(portfolio) {processPrices(portfolio, dailyTrades)});
            dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios));
          });
        } else {
          dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios));
        }
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios: ', error: error.message})))
    );
  }
}

// Update open positions with dailyTrade prices.
function processPrices(portfolio, dailyTrades) {
  portfolio.open_positions.forEach(function(position) {
    const dailyTradesIndex = dailyTrades.findIndex(dailyTrade => {return dailyTrade.stock_symbol_id === position.stock_symbol.id});
    if (dailyTradesIndex !== -1) {
      position.lastClosePrice = dailyTrades[dailyTradesIndex].close_price;
      position.lastTradeDate  = dailyTrades[dailyTradesIndex].trade_date;
      position.marketValue    = position.quantity    * parseFloat(position.lastClosePrice);
      position.gainLoss       = position.marketValue - parseFloat(position.cost);
    }
  });
}

export function sortPortfolios(portfolios, columnName, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    switch (columnName) {
      case 'name':
        portfolios.sort(ActionUtils.sort_by(columnName, reverseSort, function(a){return a.toUpperCase()}));
        break;
      case 'gainLoss':     // fall through
      case 'marketValue':  // fall through
      case 'totalCost':
        portfolios.sort(ActionUtils.sort_by(columnName, reverseSort, parseFloat));
        break;
      default:
        portfolios.sort(ActionUtils.sort_by(columnName, reverseSort));
        break;
    }
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
