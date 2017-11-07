import * as ActionUtils from '../../actions/actionUtils';
// Using a class to organize Portfolio-related logic.
// It doesn't seem worth the effort to instantiate any Portfolio objects, yet.
export default class Portfolio {
  // Return an empty Portfolio object.
  static newPortfolio() {
    return ({
      id:   '',
      name: '',
      positions: [],
    });
  }

  // Calculate account summary info.
  static computeAccountSummaries(portfolios) {
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
  static initPositionValues(portfolios) {
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
  static processPrices(portfolios, trades) {
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
    Portfolio.updateSummaries(portfolios);
  }

  // Sort Portfolios according to supplied arguments.
  static sort(portfolios, portfolioProperty, portfolioReverseSort, positionProperty, positionReverseSort) {
    // TODO put column => handler list somewhere where it will not be forgotten when a new column is added.
    // Sort portfolios.
      switch (portfolioProperty) {
      case 'name':
        portfolios.sort(ActionUtils.sortBy(portfolioProperty, portfolioReverseSort, function(a){return a.toUpperCase()}));
        break;
      case 'dayChange':    // fall through
      case 'gainLoss':     // fall through
      case 'marketValue':  // fall through
      case 'totalCost':
        portfolios.sort(ActionUtils.sortBy(portfolioProperty, portfolioReverseSort, parseFloat));
        break;
      default:
        portfolios.sort(ActionUtils.sortBy(portfolioProperty, portfolioReverseSort));
        break;
    }

    // Sort positions within portfolios.
    portfolios.forEach(function(portfolio) {
      switch (positionProperty) {
        case 'stock_symbol':
          portfolio.positions.sort(ActionUtils.sortBy(positionProperty, positionReverseSort, function(a){return a.name}));
          break;
        case 'cost':           // fall through
        case 'dayChange':      // fall through
        case 'gainLoss':       // fall through
        case 'lastTrade':      // fall through
        case 'marketValue':    // fall through
        case 'priceChange':    // fall through
        case 'quantity':
          portfolio.positions.sort(ActionUtils.sortBy(positionProperty, positionReverseSort, parseFloat));
          break;
        case 'date_acquired':  // fall through
        case 'lastTradeDate':  // fall through
        default:
          portfolio.positions.sort(ActionUtils.sortBy(positionProperty, positionReverseSort));
          break;
      }
    });
  }

  // Calculate portfolio summary info.
  static updateSummaries(portfolios) {
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
}
