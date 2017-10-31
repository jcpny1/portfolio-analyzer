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
function columnSorter(sortActionFn) {
  var lastSortColumn  = '';     // which column was last sorted.
  var lastSortReverse = false;  // was the last sort a reverse sort?
  return function(objectArray, columnName) {
    let reverseSort = lastSortReverse;
    if (lastSortColumn !== columnName) {
      lastSortColumn = columnName;
      reverseSort = false;
    } else {
      reverseSort = !reverseSort;
    }
    sortActionFn(objectArray, columnName, reverseSort);
    lastSortReverse = reverseSort;
  }
}

// Calculate account summary info.
function computeAccountSummaries(portfolios) {
  let sumMarketValue = 0.0, sumTotalCost = 0.0;
  portfolios.forEach(function(portfolio) {
    sumMarketValue += portfolio.marketValue;
    sumTotalCost   += portfolio.totalCost;
  });
  const totalGainLoss = sumMarketValue - sumTotalCost;
  return {sumMarketValue, sumTotalCost, totalGainLoss};
}

// Calculate portfolio summary info.
function computePortfolioSummaries(portfolio) {
  portfolio.marketValue = 0.0;
  portfolio.totalCost   = 0.0;
  portfolio.gainLoss    = 0.0;
  portfolio.positions.forEach(function(position) {
    if (!isNaN(position.marketValue)) {
      portfolio.totalCost    += parseFloat(position.cost);
      portfolio.marketValue  += position.marketValue;
      portfolio.gainLoss     += position.gainLoss;
    }
  });
}

// Initialize a portfolio's summary values. Return whether or not there were any positions found.
function initPortfolioValues(portfolios) {
  let positionsFound = false;
  portfolios.forEach(function(portfolio) {
    portfolio.positions.forEach(function(position) {
      initPositionValues(position);
      positionsFound = true;
    });
  });
  return positionsFound;
}

// Initialize a position's price-related values.
function initPositionValues(position) {
  position.lastTrade     = null;
  position.lastTradeDate = null;
  position.priceChange   = null;
  position.marketValue   = null;
  position.gainLoss      = null;
}

// Update a portfolio's open positions with the given trade prices.
function processPrices(portfolio, trades) {
  portfolio.positions.forEach(function(position) {
    const tradesIndex = trades.findIndex(trade => {return trade.stock_symbol_id === position.stock_symbol.id});
    if (tradesIndex !== -1) {
      position.lastTrade     = trades[tradesIndex].trade_price;
      position.priceChange   = trades[tradesIndex].price_change;
      position.lastTradeDate = trades[tradesIndex].trade_date;
      position.marketValue   = position.quantity    * parseFloat(position.lastTrade);
      position.gainLoss      = position.marketValue - parseFloat(position.cost);
    }
  });
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

// Transfer last prices from existing portfolio to updated portfolio.
//    When we update a position manually, we get back a server response without prices. So, we want to preserve the prices we already have.
//    When we refresh the pricing on a position, we want the new prices. We do not want to preserve the older prices.
function transferPortfolioPrices(srcPortfolio, tgtPortfolio) {
  srcPortfolio.positions.forEach(function(srcPosition) {
    const tgtPositionIndex = tgtPortfolio.positions.findIndex(position => {return position.id === srcPosition.id;});
    if (tgtPositionIndex !== -1) {
      const tgtPosition = tgtPortfolio.positions[tgtPositionIndex];
      if ((isNaN(tgtPosition.lastClosPrice)) && (!isNaN(srcPosition.lastTrade))) {
        tgtPosition.lastTrade   = srcPosition.lastTrade;
        tgtPosition.marketValue = tgtPosition.quantity    * parseFloat(tgtPosition.lastTrade);
        tgtPosition.gainLoss    = tgtPosition.marketValue - parseFloat(tgtPosition.cost);
      }
    }
  });
}

const ActionUtils = {checkStatus, columnSorter, computeAccountSummaries, computePortfolioSummaries, initPortfolioValues, initPositionValues, processPrices, sort_by, transferPortfolioPrices};
export default ActionUtils;
