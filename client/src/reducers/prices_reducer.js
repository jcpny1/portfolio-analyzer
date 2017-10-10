export default function pricesReducer(state= { loadingPrices: false, prices: {} }, action) {
  switch ( action.type ) {
    case 'LOADING_PRICES':
      return Object.assign({}, state, {loadingPrices: true})
    case 'LOAD_LAST_CLOSE_PRICES':
      return Object.assign({}, state, {loadingPrices: false, prices: action.payload})
    default:
      return state;
  }
}
