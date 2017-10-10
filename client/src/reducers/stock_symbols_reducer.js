export default function stockSymbolsReducer(state= { loadingStockSymbols: false, stock_symbols: [] }, action) {
  switch ( action.type ) {
    case 'LOADING_STOCK_SYMBOLS':
      return Object.assign({}, state, {loadingStockSymbols: true})
    case 'LOAD_STOCK_SYMBOLS':
      return Object.assign({}, state, {loadingStockSymbols: false, stock_symbols: action.payload})
    default:
      return state;
  }
}
