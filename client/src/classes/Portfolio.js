import * as Sort from '../utils/sort';
import Decimal from '../classes/Decimal';

export default class Portfolio {
  constructor(id = '', name = '') {
    // persisted
    this._id   = id;
    this._name = name;
    // populated from position data
    this._positions = [];
    // derived
    this.updateDerivedValues();
  }

  get id()          {return this._id}
  get cost()        {return this._cost}
  get dayChange()   {return this._dayChange}
  get gainLoss()    {return this._gainLoss}
  get marketValue() {return this._marketValue}
  get name()        {return this._name}
  get positions()   {return this._positions}

  set name(name) {this._name = name}

  // Return summary values for the given portoflios.
  static accountSummary(portfolios) {
    let sumCost = 0.0, sumDayChange = 0.0, sumGainLoss = 0.0, sumMarketValue = 0.0;
    portfolios.forEach(portfolio => {
      sumCost        += portfolio.cost;
      sumDayChange   += portfolio.dayChange;
      sumGainLoss    += portfolio.gainLoss;
      sumMarketValue += portfolio.marketValue;
    });
    sumCost = new Decimal(sumCost, 'currency');
    sumDayChange = new Decimal(sumDayChange, 'currency', 'delta');
    sumGainLoss = new Decimal(sumGainLoss, 'currency', 'delta');
    sumMarketValue = new Decimal(sumMarketValue, 'currency');
    return ({sumCost, sumDayChange, sumGainLoss, sumMarketValue});
  }

  // Update portfolios with the given trade prices.
  static applyPrices(portfolios, serverTrades) {
    portfolios.forEach(portfolio => {
      portfolio.reprice(serverTrades);
      portfolio.updateDerivedValues();
    });
  }

  reprice(serverTrades) {
    this._positions.forEach(position => {
      position.reprice(serverTrades);
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
        default:
          portfolio.positions.sort(Sort.sortBy(`_${positionProperty}`, positionReverseSort, function(a){return a.valueOf()}));
          break;
      }
    });
  }

  // Recompute portfolio summary info.
  updateDerivedValues() {
    let sumCost = 0.0, sumDayChange = 0.0, sumGainLoss = 0.0, sumMarketValue = 0.0;
    this._positions.forEach(position => {
      sumCost        += position.cost;
      sumDayChange   += position.dayChange;
      sumGainLoss    += position.gainLoss;
      sumMarketValue += position.marketValue;
    });
    this._cost        = new Decimal(sumCost,        'currency');
    this._dayChange   = new Decimal(sumDayChange,   'currency', 'delta');
    this._gainLoss    = new Decimal(sumGainLoss,    'currency', 'delta');
    this._marketValue = new Decimal(sumMarketValue, 'currency');
  }
}
