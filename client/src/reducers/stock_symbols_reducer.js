import Fmt from '../components/Formatters';

export const stockSymbolActions = {
  ERROR_STOCK_SYMBOLS:   'ERROR_STOCK_SYMBOLS',
  LOAD_STOCK_SYMBOLS:    'LOAD_STOCK_SYMBOLS',
  UPDATING_STOCK_SYMBOL: 'UPDATING_STOCK_SYMBOL',
};

export default function stockSymbolsReducer(state= { updatingStockSymbols: false, stockSymbols: [] }, action) {
  switch ( action.type ) {
    // Error on Stock Symbol action.
    case stockSymbolActions.ERROR_STOCK_SYMBOLS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingStockSymbols: false});
    }

    // Load Stock Symbols.
    case stockSymbolActions.LOAD_STOCK_SYMBOLS:
      return Object.assign({}, state, {updatingStockSymbols: false, stockSymbols: action.payload})

    // Show one or more Stock Symbols are being modified.
    case stockSymbolActions.UPDATING_STOCK_SYMBOL:
      return Object.assign({}, state, {updatingStockSymbols: true})

    // Default action.
    default:
      return state;
  }
}
