import Fmt from '../components/Formatters';

export const priceActions = {
  ERROR_PRICES:           'ERROR_PRICES',
  LOAD_LAST_CLOSE_PRICES: 'LOAD_LAST_CLOSE_PRICES',
  UPDATING_PRICE:         'UPDATING_PRICE',
};

export default function pricesReducer(state= {updatingPrices: false, prices: {} }, action) {
  switch ( action.type ) {
    // Error on Portfolio action.
    case priceActions.ERROR_PRICES: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPrices: false});
    }

    // Load Last Close Prices.
    case priceActions.LOAD_LAST_CLOSE_PRICES:
      return Object.assign({}, state, {updatingPrices: false, prices: action.payload})

    // Show one or more Last Close Prices are being modified.
    case priceActions.UPDATING_PRICE:
      return Object.assign({}, state, {updatingPrices: true})

    // Default action.
    default:
      return state;
  }
}
