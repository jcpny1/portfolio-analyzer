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

// Manage the sort status of portfolio and position properties.
// Returns the direction the property is to sorted.
function columnSorter(property, sortReverse) {
  var lastSortProperty  = property;     // which property was last sorted.
  var lastSortReverse   = sortReverse;  // was the last sort a reverse sort?
  return function(property, direction) {
    let reverseSort = lastSortReverse;
    if (direction) {
      reverseSort = (direction === 'ascending') ? false : true;
    } else {
      if (lastSortProperty !== property) {
        reverseSort = false;
      } else {
        reverseSort = !reverseSort;
      }
    }
    lastSortProperty = property;
    lastSortReverse  = reverseSort;
    return reverseSort ? 'descending' : 'ascending';
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
function processPrices(portfolio, trades) {
  portfolio.positions.forEach(function(position) {
    const tradesIndex = trades.findIndex(trade => {return trade.stock_symbol_id === position.stock_symbol.id});
    if (tradesIndex !== -1) {
      position.lastTrade     = trades[tradesIndex].trade_price;
      position.priceChange   = trades[tradesIndex].price_change;
      position.lastTradeDate = trades[tradesIndex].trade_date;
      if (position.lastTrade != null) {
        position.marketValue = position.quantity * parseFloat(position.lastTrade);
        position.gainLoss    = position.marketValue - parseFloat(position.cost);
      }
      if (position.priceChange != null) {
        position.dayChange = position.quantity * parseFloat(position.priceChange);
      }
    }
  });
  updatePortfolioSummaries(portfolio);
}

// A generic sort comparator function.
// Handles null and NaN cases (makes null/NaN's less than not null/NaN's).
var sort_by = function(field, reverse = false, compareFn) {
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
function sortPortfolios(portfolios, sorting) {
  // TODO put column => handler list somewhere where it will not be forgotten when a new column is added.

  // Sort portfolios.
  let property = sorting.portfolios.colName;
  let reverseSort = (sorting.portfolios.colDirection === 'ascending') ? false : true;
    switch (property) {
    case 'name':
      portfolios.sort(sort_by(property, reverseSort, function(a){return a.toUpperCase()}));
      break;
    case 'dayChange':    // fall through
    case 'gainLoss':     // fall through
    case 'marketValue':  // fall through
    case 'totalCost':
      portfolios.sort(sort_by(property, reverseSort, parseFloat));
      break;
    default:
      portfolios.sort(sort_by(property, reverseSort));
      break;
  }

  // Sort positions within portfolios.
  property = sorting.positions.colName;
  reverseSort = (sorting.positions.colDirection === 'ascending') ? false : true;
  portfolios.forEach(function(portfolio) {
    switch (property) {
      case 'stock_symbol':
        portfolio.positions.sort(sort_by('stock_symbol', reverseSort, function(a){return a.name}));
        break;
      case 'cost':           // fall through
      case 'dayChange':      // fall through
      case 'gainLoss':       // fall through
      case 'lastTrade':      // fall through
      case 'marketValue':    // fall through
      case 'priceChange':    // fall through
      case 'quantity':
        portfolio.positions.sort(sort_by(property, reverseSort, parseFloat));
        break;
      case 'date_acquired':  // fall through
      case 'lastTradeDate':  // fall through
      default:
        portfolio.positions.sort(sort_by(property, reverseSort));
        break;
    }
  });
}

// Calculate portfolio summary info.
function updatePortfolioSummaries(portfolio) {
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
}

const ActionUtils = {checkStatus, columnSorter, computeAccountSummaries, initPortfolioPositionValues, processPrices, sortPortfolios, updatePortfolioSummaries};
export default ActionUtils;
