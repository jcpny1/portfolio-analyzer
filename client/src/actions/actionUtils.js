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

// Call the appropriate action function to sort an array by column name.
// Sort direction is optional and overrides the calculated direction.
// Returns direction column was sorted.
function columnSorter(sortActionFn) {
  var lastSortColumn  = '';     // which column was last sorted.
  var lastSortReverse = false;  // was the last sort a reverse sort?
  return function(objectArray, columnName, property, direction) {
    let reverseSort = lastSortReverse;
    if (direction) {
      reverseSort = (direction === 'ascending') ? false : true;
    } else {
      if (lastSortColumn !== columnName) {
        lastSortColumn = columnName;
        reverseSort = false;
      } else {
        reverseSort = !reverseSort;
      }
    }


////// closure on sortArray is probably overkill.

    var sortFn = sortActionFn(columnName, property, reverseSort);
    sortFn(objectArray);


    lastSortReverse = reverseSort;
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

// Sort an object array.
function sortArray(colName, property, reverseSort) {
  return function(array) {
    // TODO put column => handler list somewhere where it will not be forgotten when a new column is added.
    switch (colName) {
      case 'Portfolio.name':
        array.sort(sort_by(property, reverseSort, function(a){return a.toUpperCase()}));
        break;
      case 'Position.stock_symbol':
        array.sort(ActionUtils.sort_by('stock_symbol', reverseSort, function(a){return a.name}));
        break;
      case 'Portfolio.dayChange':     // fall through
      case 'Portfolio.gainLoss':      // fall through
      case 'Portfolio.marketValue':   // fall through
      case 'Portfolio.totalCost':     // fall through
      case 'Position.cost':           // fall through
      case 'Position.dayChange':      // fall through
      case 'Position.gainLoss':       // fall through
      case 'Position.lastTrade':      // fall through
      case 'Position.marketValue':    // fall through
      case 'Position.priceChange':    // fall through
      case 'Position.quantity':
        array.sort(sort_by(property, reverseSort, parseFloat));
        break;
      case 'Position.date_acquired': // fall through
      case 'Position.lastTradeDate': // fall through
      default:
        array.sort(sort_by(property, reverseSort));
        break;
    }
  }
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

const ActionUtils = {checkStatus, columnSorter, computeAccountSummaries, initPortfolioPositionValues, processPrices, sort_by, sortArray, updatePortfolioSummaries};
export default ActionUtils;
