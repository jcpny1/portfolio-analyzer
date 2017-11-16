import Fmt from '../utils/formatters';

// Check a fetch response status.
export function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.log(error);
  }
  return response;
}

// Manage the sort status of an object array's properties.
// Calling with no arguments, returns current sorting info.
export function columnSorter(initialPrimaryProperty, initialPrimaryDirection, initialSecondaryProperty, initialSecondaryDirection) {
  var lastPrimaryProperty    = initialPrimaryProperty;     // which property was last sorted.
  var lastPrimaryDirection   = initialPrimaryDirection;
  var lastSecondaryProperty  = initialSecondaryProperty;   // which property was last sorted.
  var lastSecondaryDirection = initialSecondaryDirection;
  var lastPrimaryReverseSort   = (lastPrimaryDirection   === 'ascending') ? false : true;   // convert asc|desc to false|true.
  var lastSecondaryReverseSort = (lastSecondaryDirection === 'ascending') ? false : true;   // convert asc|desc to false|true.
  return function(objectArray, sortFn, primaryProperty, secondaryProperty) {
    if (typeof objectArray === 'undefined') {
      var lastPrimaryDirection    = (lastPrimaryReverseSort)   ? 'descending' : 'ascending';
      var lastSecondaryDirection  = (lastSecondaryReverseSort) ? 'descending' : 'ascending';
      return {primary: {property: lastPrimaryProperty, direction: lastPrimaryDirection}, secondary: {property: lastSecondaryProperty, direction: lastSecondaryDirection}};
    }
    if (primaryProperty) {
      lastPrimaryReverseSort = (lastPrimaryProperty === primaryProperty) ? !lastPrimaryReverseSort : false;
      lastPrimaryProperty    = primaryProperty;
    }
    if (secondaryProperty) {
      lastSecondaryReverseSort = (lastSecondaryProperty === secondaryProperty) ? !lastSecondaryReverseSort : false;
      lastSecondaryProperty    = secondaryProperty;
    }
    sortFn(objectArray, lastPrimaryProperty, lastPrimaryReverseSort, lastSecondaryProperty, lastSecondaryReverseSort);
  }
}

// Lookup instrument by value.
// params={field, value, exact}
// Specify option 'exact' as true (for an exact match) or false (for a partial match).
export function instrumentSearch(params, cb) {
  const exact = params.exact ? '&exact' : '';
  return fetch(`/api/instruments?v=${encodeURI(params.value)}${exact}`, {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(error.message)});
}

// Request the server to refresh the symbololgy database.
export function refreshHeadlines(cb) {
  fetch('/api/headlines', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Headlines: '));});
}

// Request the server to refresh market indexes.
export function refreshIndexes(cb) {
  fetch('/api/last-index?symbols=DJIA', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Indexes: '));});
}

// Request the server to refresh trade prices.
export function refreshPrices() {
  fetch('/api/trades/refresh', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Prices: '));});
}

// Request the server to refresh the symbololgy database.
export function refreshInstruments() {
  fetch('/api/instruments/refresh', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Symbols: '));});
}

// A generic sort comparator function.
// (considers nulls and NaN's to be less than not nulls and NaN's).
export var sortBy = function(field, reverse = false, compareFn) {
  var key = function (x) {return compareFn ? compareFn(x[field]) : x[field]};
  return function (a,b) {
    const A = key(a), B = key(b), reverseSort = [1,-1][+!!reverse];
    if ((typeof A === 'number') && (typeof B === 'number')) {
      return sortByNumber(A, B, reverseSort);
    }
    return sortByOther(A, B, reverseSort);
  }
}

// Sort two numbers.
// (considers nulls and NaN's to be less than not nulls and NaN's).
function sortByNumber(A, B, reverseSort) {
  if (!isFinite(A) || !isFinite(B)) {  // Special cases
    if (!isFinite(A) && !isFinite(B)) {
      return 0;
    } else if (!isFinite(A) && isFinite(B)) {
      return -1 * reverseSort;
    } else if (isFinite(A) && !isFinite(B)) {
      return 1 * reverseSort;
    }
  }
  return ( (A < B) ? -1 : ( (A > B) ? 1 : 0 ) ) * reverseSort;
}

// Sort two non-numbers.
// (considers nulls and NaN's to be less than not nulls and NaN's).
function sortByOther(A, B, reverseSort) {
  if (!A || !B) {  // Special cases
    if (!A && !B) {
      return 0;
    } else if (!A && B) {
      return -1 * reverseSort;
    } else if (A && !B) {
      return 1 * reverseSort;
    }
  }
  return ( (A < B) ? -1 : ( (A > B) ? 1 : 0 ) ) * reverseSort;
}
