import * as Request from '../utils/request';
import Decimal  from '../classes/Decimal';

export default class Position {
  constructor(portfolio_id, id = '', instrument = {}, quantity = 0.0, cost = 0.0, date_acquired = '') {
    // persisted
    this.portfolio_id  = portfolio_id;
    this.id            = id;
    this.instrument    = instrument;
    this.quantity      = new Decimal(quantity, 'quantity');
    this.cost          = new Decimal(cost, 'currency');
    this.date_acquired = date_acquired;
    // from market data
    this.lastTrade     = new Decimal(0.0, 'currency');
    this.lastTradeDate = '';
    this.priceChange   = new Decimal(0.0, 'currency', 'delta');
    // derived
    this.dayChange     = new Decimal(0.0, 'currency', 'delta');
    this.gainLoss      = new Decimal(0.0, 'currency', 'delta');
    this.marketValue   = new Decimal(0.0, 'currency');
  }

  reprice(trades) {
    const tradesIndex = trades.findIndex(trade => {return trade.instrument_id === this.instrument.id});
    if (tradesIndex !== -1) {
      this.lastTrade.value   = parseFloat(trades[tradesIndex].trade_price);
      this.priceChange.value = parseFloat(trades[tradesIndex].price_change);
      this.lastUpdate        = trades[tradesIndex].created_at;
      if (new Date(trades[tradesIndex].trade_date).getTime() !== 0) {
        this.lastTradeDate = trades[tradesIndex].trade_date;
      }
      if (this.lastTrade != null) {
        this.marketValue.value = this.quantity * this.lastTrade;
        this.gainLoss.value    = this.marketValue - this.cost;
      }
      if (this.priceChange != null) {
        this.dayChange.value = this.quantity * this.priceChange;
      }
    }
  }

  // If position is valid, returns null. Otherwise, returns error message.
  static validate(position, cb) {
    let errorReturn = null;
    if (!(/^[A-Z.*+-]+$/.test(position.instrument_symbol))) {
      errorReturn = {name: 'instrument_symbol', message: 'Symbol is not valid.'};
    } else if (!(parseFloat(position.quantity) >= 0)) {
      errorReturn = {name: 'quantity', message: 'Quantity must be greater than or equal to zero.'};
    } else if (position.cost < 0.0) {
      errorReturn = {name: 'cost', message: 'Cost must be greater than or equal to zero.'};
    } else if (isNaN(Date.parse(position.date_acquired))) {
      errorReturn = {name: 'date_acquired', message: 'Date Acquired is not valid.'};
    }
    if (errorReturn === null) {
      Request.instrumentSearch({value: position.instrument_symbol, exact:true}, instruments => {
        if (instruments.length !== 1) {
          errorReturn = {name: 'instrument_symbol', message: 'Symbol is not valid.'};
        }
        cb(errorReturn);
      });
    } else {
      cb(errorReturn);
    }
  }
}
