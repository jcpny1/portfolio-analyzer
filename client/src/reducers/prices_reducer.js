import Fmt from '../components/Formatters';

export const priceActions = {
  ERROR_PRICES:           'ERROR_PRICES',
  LOAD_LAST_CLOSE_PRICES: 'LOAD_LAST_CLOSE_PRICES',
  UPDATING_PRICE:         'UPDATING_PRICE',
};

export default function pricesReducer(state= {updatingPrices: false, prices: [] }, action) {
  switch ( action.type ) {
    // Error on Portfolio action.
    case priceActions.ERROR_PRICES: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPrices: false});
    }

    // Update prices with last close prices.
    case priceActions.LOAD_LAST_CLOSE_PRICES: {
      const newPrices = Object.assign([], state.prices);
      action.payload.forEach(function(payloadPrice) {
        const newPricesIndex = newPrices.findIndex(newPrice => {return payloadPrice.stock_symbol_id === newPrice.stock_symbol_id;});
        (newPricesIndex === -1) ? newPrices.push(payloadPrice) : newPrices[newPricesIndex] = payloadPrice;
      });
      return Object.assign({}, state, {updatingPrices: false, prices: newPrices})
    }

    // Show one or more Last Close Prices are being modified.
    case priceActions.UPDATING_PRICE:
      return Object.assign({}, state, {updatingPrices: true})

    // Default action.
    default:
      return state;
  }
}
