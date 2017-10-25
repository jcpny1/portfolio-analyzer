import fetch from 'isomorphic-fetch';
import ActionUtils from './actionUtils';
import * as StockSymbolReducerFunctions from '../reducers/stock_symbols_reducer';

// Fetch stock symbols from server.
export function loadStockSymbols() {
  return function(dispatch) {
    dispatch(StockSymbolReducerFunctions.updatingStockSymbolAction());
    return (
      fetch('/api/stock_symbols', {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(stockSymbols => {
        if (!stockSymbols.length) {
          throw new Error('Empty response from server');
        }
        dispatch(StockSymbolReducerFunctions.updateStockSymbolsAction(stockSymbols));
      })
      .catch(error => dispatch(StockSymbolReducerFunctions.errorStockSymbolAction({prefix: 'Load Stock Symbols Error: ', error: error})))
    );
  }
}
