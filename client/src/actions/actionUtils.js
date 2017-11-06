import Fmt from '../components/Formatters';

// Check a fetch response status.
function checkStatus(response) {
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
function columnSorter(initialPortfolioProperty, initialPortfolioDirection, initialPositionProperty, initialPositionDirection) {
  var lastPortfolioProperty    = initialPortfolioProperty;     // which property was last sorted.
  var lastPortfolioDirection   = initialPortfolioDirection;
  var lastPortfolioReverseSort = (lastPortfolioDirection === 'ascending') ? false : true;
  var lastPositionProperty     = initialPositionProperty;     // which property was last sorted.
  var lastPositionDirection    = initialPositionDirection;
  var lastPositionReverseSort  = (lastPositionDirection === 'ascending') ? false : true;
  return function(portfolios, portfolioProperty, positionProperty) {
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
    sortPortfolios(portfolios, lastPortfolioProperty, lastPortfolioReverseSort, lastPositionProperty, lastPositionReverseSort);
  }
}

// Calculate account summary info.
function computeAccountSummaries(portfolios) {
  let sumMarketValue = 0.0, sumTotalCost = 0.0, sumDayChange = 0.0;
  portfolios.forEach(function(portfolio) {
    sumMarketValue += portfolio.marketValue;
    sumTotalCost   += portfolio.totalCost;
    sumDayChange   += portfolio.dayChange;
  });
  const sumGainLoss = sumMarketValue - sumTotalCost;
  return {sumMarketValue, sumTotalCost, sumDayChange, sumGainLoss,};
}

// Initialize portfolio and position values for each portfolio.
function initPortfolioPositionValues(portfolios) {
  portfolios.forEach(function(portfolio) {
    portfolio.totalCost   = 0.0;
    portfolio.marketValue = 0.0;
    portfolio.dayChange   = 0.0;
    portfolio.gainLoss    = 0.0;
    portfolio.positions.forEach(function(position) {
      position.lastTrade     = null;
      position.lastTradeDate = null;
      position.priceChange   = null;
      position.marketValue   = null;
      position.dayChange     = null;
      position.gainLoss      = null;
    });
  });
}

// Update a portfolio's positions with the given trade prices.
function processPrices(portfolios, trades) {
  portfolios.forEach(portfolio => {
    portfolio.positions.forEach(function(position) {
      const tradesIndex = trades.findIndex(trade => {return trade.stock_symbol_id === position.stock_symbol.id});
      if (tradesIndex !== -1) {
        position.lastTrade     = trades[tradesIndex].trade_price;
        position.priceChange   = trades[tradesIndex].price_change;
        position.lastUpdate    = trades[tradesIndex].created_at;
        if (new Date(trades[tradesIndex].trade_date).getTime() !== 0) {
          position.lastTradeDate = trades[tradesIndex].trade_date;
        }
        if (position.lastTrade != null) {
          position.marketValue = position.quantity * parseFloat(position.lastTrade);
          position.gainLoss    = position.marketValue - parseFloat(position.cost);
        }
        if (position.priceChange != null) {
          position.dayChange = position.quantity * parseFloat(position.priceChange);
        }
      }
    });
  });
  updatePortfolioSummaries(portfolios);
}

// Request the server to refresh the symbololgy database.
function refreshSymbols() {
  fetch('/api/stock_symbols/refresh', {headers: {'Accept': 'application/json'}})
  .then(ActionUtils.checkStatus)
  .catch(error => {alert(Fmt.serverError(error, 'Refresh Symbols: '));});
}

// Lookup stock symbol by [partial] name.
// Specify option 'exact' as true or false accordingly.
function symbolSearch(params, cb) {
  const exact = params.exact ? 'exact' : '';
  return fetch(`/api/stock_symbols?f=${params.field}&v=${params.value}&${exact}`, {headers: {'Accept': 'application/json'}})
  .then(ActionUtils.checkStatus)
  .then(response => response.json())
  .then(cb)
  .catch(error => {alert(error.message)});
}

// A generic sort comparator function.
// Handles null and NaN cases (makes null/NaN's less than not null/NaN's).
var sortBy = function(field, reverse = false, compareFn) {
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

// Sort Portfolios according to supplied arguments.
function sortPortfolios(portfolios, portfolioProperty, portfolioReverseSort, positionProperty, positionReverseSort) {
  // TODO put column => handler list somewhere where it will not be forgotten when a new column is added.
  // Sort portfolios.
    switch (portfolioProperty) {
    case 'name':
      portfolios.sort(sortBy(portfolioProperty, portfolioReverseSort, function(a){return a.toUpperCase()}));
      break;
    case 'dayChange':    // fall through
    case 'gainLoss':     // fall through
    case 'marketValue':  // fall through
    case 'totalCost':
      portfolios.sort(sortBy(portfolioProperty, portfolioReverseSort, parseFloat));
      break;
    default:
      portfolios.sort(sortBy(portfolioProperty, portfolioReverseSort));
      break;
  }

  // Sort positions within portfolios.
  portfolios.forEach(function(portfolio) {
    switch (positionProperty) {
      case 'stock_symbol':
        portfolio.positions.sort(sortBy(positionProperty, positionReverseSort, function(a){return a.name}));
        break;
      case 'cost':           // fall through
      case 'dayChange':      // fall through
      case 'gainLoss':       // fall through
      case 'lastTrade':      // fall through
      case 'marketValue':    // fall through
      case 'priceChange':    // fall through
      case 'quantity':
        portfolio.positions.sort(sortBy(positionProperty, positionReverseSort, parseFloat));
        break;
      case 'date_acquired':  // fall through
      case 'lastTradeDate':  // fall through
      default:
        portfolio.positions.sort(sortBy(positionProperty, positionReverseSort));
        break;
    }
  });
}

// Calculate portfolio summary info.
function updatePortfolioSummaries(portfolios) {
  portfolios.forEach(portfolio => {
    portfolio.totalCost   = 0.0;
    portfolio.marketValue = 0.0;
    portfolio.dayChange   = 0.0;
    portfolio.gainLoss    = 0.0;
    portfolio.positions.forEach(function(position) {
      if (!isNaN(position.marketValue)) {
        portfolio.totalCost    += parseFloat(position.cost);
        portfolio.marketValue  += position.marketValue;
        portfolio.dayChange    += position.dayChange;
        portfolio.gainLoss     += position.gainLoss;
      }
    });
  });
}

// If position is valid, returns null. Otherwise, returns error message.
function validatePosition(position) {
  let errorReturn = null;
  if (!(/^[A-Z]+$/.test(position.stock_symbol_name))) {
    errorReturn = {name: 'stock_symbol_name', message: 'Symbol is not valid.'};
  } else if (!(parseFloat(position.quantity) >= 0)) {
    errorReturn = {name: 'quantity', message: 'Quantity must be greater than or equal to zero.'};
  } else if (!(parseFloat(position.cost) >= 0)) {
    errorReturn = {name: 'cost', message: 'Cost must be greater than or equal to zero.'};
  } else if (isNaN(Date.parse(position.date_acquired))) {
    errorReturn = {name: 'date_acquired', message: 'Date Acquired is not valid.'};
  }
  return errorReturn;
}

const ActionUtils = {
  checkStatus,
  columnSorter,
  computeAccountSummaries,
  initPortfolioPositionValues,
  processPrices,
  refreshSymbols,
  symbolSearch,
  sortPortfolios,
  validatePosition
};
export default ActionUtils;
