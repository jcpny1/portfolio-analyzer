import * as Sort from '../utils/sort';
import Decimal from '../classes/Decimal';
import Position from './Position';

export default class Portfolio {
  constructor(id = '', name = '', loadedPositions = []) {
    // persisted
    this._id        = id;
    this._name      = name;
    this._positions = [];
    // derived
    this._cost        = new Decimal(0.0, 'currency');
    this._dayChange   = new Decimal(0.0, 'currency', 'delta');
    this._gainLoss    = new Decimal(0.0, 'currency', 'delta');
    this._marketValue = new Decimal(0.0, 'currency');
    // load positions into instance.
    loadedPositions.forEach(loadedPosition => this.addPosition(loadedPosition));
  }

  get id()          { return this._id }
  get cost()        { return this._cost }
  get dayChange()   { return this._dayChange }
  get gainLoss()    { return this._gainLoss }
  get marketValue() { return this._marketValue }
  get name()        { return this._name }
  get positions()   { return this._positions }

  set name(name) { this._name = name }

  // Return summary values for given portoflios.
  static accountSummary(portfolios) {
    let sumMarketValue = new Decimal(0.0, 'currency'), sumCost = new Decimal(0.0, 'currency'), sumDayChange = new Decimal(0.0, 'currency', 'delta');
    portfolios.forEach(portfolio => {
      sumMarketValue.value += portfolio.marketValue;
      sumCost.value        += portfolio.cost;
      sumDayChange.value   += portfolio.dayChange;
    });
    const sumGainLoss = new Decimal(sumMarketValue - sumCost, 'currency', 'delta');
    return {sumMarketValue, sumCost, sumDayChange, sumGainLoss};
  }

  addPosition(loadedPosition) {
    this._positions.push(new Position(loadedPosition.portfolio_id, loadedPosition.id, loadedPosition.instrument, loadedPosition.quantity, loadedPosition.cost, loadedPosition.date_acquired));
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
    this._positions.forEach(position => {
      position.reprice(trades);
    });
  }

  // Sort Portfolios according to supplied arguments.
  static sort(portfolios, portfolioProperty, portfolioReverseSort, positionProperty, positionReverseSort) {
    // TODO: put column => handler list somewhere where it will not be forgotten when a new column is added.
    // Sort portfolios.
      switch (portfolioProperty) {
      case 'name':
        portfolios.sort(Sort.sortBy(`_${portfolioProperty}`, portfolioReverseSort, function(a){return a.toUpperCase()}));
        break;
      case 'dayChange':    // fall through
      case 'gainLoss':     // fall through
      case 'marketValue':  // fall through
      case 'cost':         // fall through
      default:
        portfolios.sort(Sort.sortBy(`_${portfolioProperty}`, portfolioReverseSort));
        break;
    }

    // Sort positions within portfolios.
    portfolios.forEach(portfolio => {
      switch (positionProperty) {
        case 'symbol':
          portfolio._positions.sort(Sort.sortBy('_instrument', positionReverseSort, function(a){return a.symbol}));
          break;
        case 'cost':           // fall through
        case 'dayChange':      // fall through
        case 'gainLoss':       // fall through
        case 'lastTrade':      // fall through
        case 'marketValue':    // fall through
        case 'priceChange':    // fall through
        case 'quantity':       // fall through
        case 'date_acquired':  // fall through
        case 'lastTradeDate':  // fall through
        default:
          portfolio.positions.sort(Sort.sortBy(`_${positionProperty}`, positionReverseSort));
          break;
      }
    });
  }

  // Calculate portfolio summary info.
  updateDerivedValues() {
    this._cost.value        = 0.0;
    this._dayChange.value   = 0.0;
    this._gainLoss.value    = 0.0;
    this._marketValue.value = 0.0;
    this._positions.forEach(position => {
      if (!isNaN(position.marketValue)) {
        this._cost.value        += position.cost;
        this._dayChange.value   += position.dayChange;
        this._gainLoss.value    += position.gainLoss;
        this._marketValue.value += position.marketValue;
      }
    });
  }
}
