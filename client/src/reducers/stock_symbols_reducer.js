import Fmt from '../components/Formatters';

export const stockSymbolActions = {
  ERROR_STOCK_SYMBOLS  : 'ERROR_STOCK_SYMBOLS',
  UPDATE_STOCK_SYMBOLS : 'UPDATE_STOCK_SYMBOLS',
  UPDATING_STOCK_SYMBOL: 'UPDATING_STOCK_SYMBOL',
};

export function errorStockSymbolAction(error)          {return {type: stockSymbolActions.ERROR_STOCK_SYMBOLS,  payload: error}}
export function updateStockSymbolsAction(stockSymbols) {return {type: stockSymbolActions.UPDATE_STOCK_SYMBOLS, payload: stockSymbols}}
export function updatingStockSymbolAction()            {return {type: stockSymbolActions.UPDATING_STOCK_SYMBOL}}

export function stockSymbolsReducer(state= { updatingStockSymbol: false, stockSymbols: [] }, action) {
  switch ( action.type ) {
    // Error on Stock Symbol action.
    case stockSymbolActions.ERROR_STOCK_SYMBOLS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingStockSymbol: false});
    }

    // Update all Stock Symbols.
    case stockSymbolActions.UPDATE_STOCK_SYMBOLS:
      const payloadStockSymbols = action.payload;
      return Object.assign({}, state, {updatingStockSymbol: false, stockSymbols: payloadStockSymbols});

    // Show one or more Stock Symbols are being modified.
    case stockSymbolActions.UPDATING_STOCK_SYMBOL:
      return Object.assign({}, state, {updatingStockSymbol: true});

    // Default action.
    default:
      return state;
  }
}
