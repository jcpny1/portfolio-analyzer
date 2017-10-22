import fetch from 'isomorphic-fetch';
import Fetch from '../utils/fetch';
import {priceActions} from '../reducers/prices_reducer';

function errorPriceAction(payload)          {return {type: priceActions.ERROR_PRICES,            payload: payload};}
function loadLastClosePricesAction(payload) {return {type: priceActions.LOAD_LAST_CLOSE_PRICES,  payload: payload};}
function updatingLastClosePriceAction()     {return {type: priceActions.UPDATING_PRICE};}

export function loadLastClosePrices(positions) {
  let symbols = positions.map( function(position) {return position.stock_symbol.name});
  if (symbols.length > 0) {
    return function(dispatch) {
      dispatch(updatingLastClosePriceAction());
      return (
        fetch(`/api/daily_trades/last_close?symbols=${symbols.toString()}`)
        .then(Fetch.checkStatus)
        .then(response => response.json())
        .then(responseJson => {
          if (!responseJson.length) {
            throw new Error('Empty response from server');
          }
          dispatch(loadLastClosePricesAction(responseJson));
        })
        .catch(error => dispatch(errorPriceAction({prefix: 'Load Last Close Prices: ', error: error})))
      )
    }
  }
}
