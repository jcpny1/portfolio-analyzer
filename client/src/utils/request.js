import fetch from 'isomorphic-fetch';
import Fmt from '../utils/formatter';

// Request the server to refresh the symbololgy database.
export function headlinesRefresh(cb) {
  fetch('/api/headlines', {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError('Refresh Headlines', error));});
}

// Request the server to refresh market indexes.
export function indexesRefresh(cb) {
  fetch('/api/last-index?symbols=DJIA', {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError('Refresh Indexes', error));});
}

// Lookup instrument by value.
//   params={field, value, exact}
//   Specify option 'exact' as true (for an exact match) or false (for a partial match).
export function instrumentSearch(params, cb) {
  const exact = params.exact ? '&exact' : '';
  return fetch(`/api/instruments?v=${encodeURI(params.value)}${exact}`, {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(error.message)});
}

// Request the server to refresh the symbololgy database.
export function instrumentsRefresh() {
  fetch('/api/instruments/refresh', {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .catch(error => {alert(Fmt.serverError('Refresh Symbols', error));});
}

// Request the server to refresh trade prices.
export function pricesRefresh() {
  fetch('/api/trades/refresh', {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .catch(error => {alert(Fmt.serverError('Refresh Prices', error));});
}

// Request the server to refresh series data.
export function seriesRefresh(cb) {
  fetch('/api/monthly-series?symbols=DIA,SPY,URTH', {headers: {'Accept': 'application/json'}})
  .then(statusCheck)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError('Refresh Series', error));});
}

// Check a fetch response status.
export function statusCheck(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.log(error);
  }
  return response;
}
