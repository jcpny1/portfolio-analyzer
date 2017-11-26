import * as Sort from '../utils/sort';
import Currency  from '../classes/Currency';
import Position from './Position';

export default class Portfolio {
  constructor(id = '', name = '', loadedPositions = []) {
    // persisted
    this.id        = id;
    this.name      = name;
    this.positions = [];
    // derived
    this.cost        = new Currency(0.0);
    this.dayChange   = new Currency(0.0, 'delta');
    this.gainLoss    = new Currency(0.0, 'delta');
    this.marketValue = new Currency(0.0);
    loadedPositions.forEach(loadedPosition => this.addPosition(loadedPosition));
  }

  // Return summary values for given portoflios.
  static accountSummary(portfolios) {
    let sumMarketValue = 0.0, sumCost = 0.0, sumDayChange = 0.0;
    portfolios.forEach(portfolio => {
      sumMarketValue += portfolio.marketValue;
      sumCost        += portfolio.cost;
      sumDayChange   += portfolio.dayChange;
    });
    const sumGainLoss = sumMarketValue - sumCost;
    return {sumMarketValue, sumCost, sumDayChange, sumGainLoss};
  }

  addPosition(loadedPosition) {
    this.positions.push(new Position(loadedPosition.portfolio_id, loadedPosition.id, loadedPosition.instrument, loadedPosition.quantity, loadedPosition.cost, loadedPosition.date_acquired));
    this.updateDerivedValues();
  }

  // Update portfolios with the given trade prices.
  static applyPrices(portfolios, trades) {
    portfolios.forEach(portfolio => {
      portfolio.reprice(trades);
      portfolio.updateDerivedValues();
    });
  }

  reprice(trades) {
    this.positions.forEach(position => {
      position.reprice(trades);
    });
  }

  // Sort Portfolios according to supplied arguments.
  static sort(portfolios, portfolioProperty, portfolioReverseSort, positionProperty, positionReverseSort) {
    // TODO: put column => handler list somewhere where it will not be forgotten when a new column is added.
    // Sort portfolios.
      switch (portfolioProperty) {
      case 'name':
        portfolios.sort(Sort.sortBy(portfolioProperty, portfolioReverseSort, function(a){return a.toUpperCase()}));
        break;
      case 'dayChange':    // fall through
      case 'gainLoss':     // fall through
      case 'marketValue':  // fall through
      case 'cost':
        portfolios.sort(Sort.sortBy(portfolioProperty, portfolioReverseSort, parseFloat));
        break;
      default:
        portfolios.sort(Sort.sortBy(portfolioProperty, portfolioReverseSort));
        break;
    }

    // Sort positions within portfolios.
    portfolios.forEach(portfolio => {
      switch (positionProperty) {
        case 'symbol':
          portfolio.positions.sort(Sort.sortBy('instrument', positionReverseSort, function(a){return a.symbol}));
          break;
        case 'cost':           // fall through
        case 'dayChange':      // fall through
        case 'gainLoss':       // fall through
        case 'lastTrade':      // fall through
        case 'marketValue':    // fall through
        case 'priceChange':    // fall through
        case 'quantity':
          portfolio.positions.sort(Sort.sortBy(positionProperty, positionReverseSort, parseFloat));
          break;
        case 'date_acquired':  // fall through
        case 'lastTradeDate':  // fall through
        default:
          portfolio.positions.sort(Sort.sortBy(positionProperty, positionReverseSort));
          break;
      }
    });
  }

  // Calculate portfolio summary info.
  updateDerivedValues() {
    this.cost.value        = 0.0;
    this.dayChange.value   = 0.0;
    this.gainLoss.value    = 0.0;
    this.marketValue.value = 0.0;
    this.positions.forEach(position => {
      if (!isNaN(position.marketValue)) {
        this.cost.value        += position.cost;
        this.dayChange.value   += position.dayChange;
        this.gainLoss.value    += position.gainLoss;
        this.marketValue.value += position.marketValue;
      }
    });
  }
}
