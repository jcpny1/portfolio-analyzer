import Fmt from '../components/Formatters';

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

// Manage the sort status of portfolio and position object arrays.
// Calling with no arguments, returns current sorting info.
export function columnSorter(initialPortfolioProperty, initialPortfolioDirection, initialPositionProperty, initialPositionDirection) {
  var lastPortfolioProperty    = initialPortfolioProperty;     // which property was last sorted.
  var lastPortfolioDirection   = initialPortfolioDirection;
  var lastPortfolioReverseSort = (lastPortfolioDirection === 'ascending') ? false : true;
  var lastPositionProperty     = initialPositionProperty;     // which property was last sorted.
  var lastPositionDirection    = initialPositionDirection;
  var lastPositionReverseSort  = (lastPositionDirection === 'ascending') ? false : true;
  return function(portfolios, sortFn, portfolioProperty, positionProperty) {
    if (typeof portfolios === 'undefined') {
      var lastPortfolioDirection = (lastPortfolioReverseSort) ? 'descending' : 'ascending';
      var lastPositionDirection  = (lastPositionReverseSort)  ? 'descending' : 'ascending';
      return {portfolios: {property: lastPortfolioProperty, direction: lastPortfolioDirection}, positions: {property: lastPositionProperty, direction: lastPositionDirection}};
    }
    if (portfolioProperty) {
      let portfolioReverseSort = lastPortfolioReverseSort;
      if (lastPortfolioProperty !== portfolioProperty) {
        portfolioReverseSort = false;
      } else {
        portfolioReverseSort = !portfolioReverseSort;
      }
      lastPortfolioProperty    = portfolioProperty;
      lastPortfolioReverseSort = portfolioReverseSort;
    }
    if (positionProperty) {
      let positionReverseSort = lastPositionReverseSort;
      if (lastPositionProperty !== positionProperty) {
        positionReverseSort = false;
      } else {
        positionReverseSort = !positionReverseSort;
      }
      lastPositionProperty    = positionProperty;
      lastPositionReverseSort = positionReverseSort;
    }
    sortFn(portfolios, lastPortfolioProperty, lastPortfolioReverseSort, lastPositionProperty, lastPositionReverseSort);
  }
}

// Request the server to refresh the symbololgy database.
export function refreshSymbols() {
  fetch('/api/stock_symbols/refresh', {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Symbols: '));});
}

// Lookup stock symbol field by value.
// params={field, value, exact}
// Specify option 'exact' as true (for an exact match) or false (for a partial match).
export function symbolSearch(params, cb) {
  const exact = params.exact ? 'exact' : '';
  return fetch(`/api/stock_symbols?f=${params.field}&v=${params.value}&${exact}`, {headers: {'Accept': 'application/json'}})
  .then(checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(error.message)});
}

// A generic sort comparator function.
// (makes nulls/NaN's less than not nulls/NaN's).
export var sortBy = function(field, reverse = false, compareFn) {
  var key = function (x) {return compareFn ? compareFn(x[field]) : x[field]};
  return function (a,b) {
    var A = key(a), B = key(b);
    if ((typeof A === 'number') && (typeof B === 'number')) {
      if (!isFinite(A) && !isFinite(B)) {
        return 0;
      } else if (!isFinite(A) && isFinite(B)) {
        return -1 * [1,-1][+!!reverse];
      } else if (isFinite(A) && !isFinite(B)) {
        return 1 * [1,-1][+!!reverse];
      }
    } else {
      if (!A && !B) {
        return 0;
      } else if (!A && B) {
        return -1 * [1,-1][+!!reverse];
      } else if (A && !B) {
        return 1 * [1,-1][+!!reverse];
      }
    }
    return ( (A < B) ? -1 : ( (A > B) ? 1 : 0 ) ) * [1,-1][+!!reverse];
  }
}
