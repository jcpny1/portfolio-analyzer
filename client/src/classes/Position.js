import * as Request from '../utils/request';
import DateTime from '../classes/DateTime';
import Decimal from '../classes/Decimal';
import Instrument from '../classes/Instrument';

export default class Position {
  constructor(portfolio_id, id = '', instrument = {id: '', symbol: '', name: ''}, quantity = 0.0, cost = 0.0, date_acquired = '') {
    // persisted
    this._portfolio_id  = portfolio_id;
    this._id            = id;
    this._instrument    = new Instrument(instrument.id, instrument.symbol, instrument.name);
    this._quantity      = new Decimal(quantity, 'quantity');
    this._cost          = new Decimal(cost, 'currency');
    this._date_acquired = new DateTime(date_acquired);
    // from market data
    this._lastTrade     = new Decimal(0.0, 'currency');
    this._lastTradeDate = new DateTime();
    this._priceChange   = new Decimal(0.0, 'currency', 'delta');
    this._lastUpdate    = new DateTime();
    // derived
    this._dayChange     = new Decimal(0.0, 'currency', 'delta');
    this._gainLoss      = new Decimal(0.0, 'currency', 'delta');
    this._marketValue   = new Decimal(0.0, 'currency');
  }

  get cost()          { return this._cost }
  get date_acquired() { return this._date_acquired }
  get dayChange()     { return this._dayChange }
  get gainLoss()      { return this._gainLoss }
  get id()            { return this._id }
  get instrument()    { return this._instrument }
  get lastTrade()     { return this._lastTrade }
  get lastUpdate()    { return this._lastUpdate }
  get lastTradeDate() { return this._lastTradeDate }
  get marketValue()   { return this._marketValue }
  get portfolio_id()  { return this._portfolio_id }
  get priceChange()   { return this._priceChange }
  get quantity()      { return this._quantity }

  reprice(trades) {
    const trade = trades.find(trade => trade.instrument_id === this._instrument.id);
    if (trade) {
      this._lastTrade.value   = trade.trade_price;
      this._priceChange.value = trade.price_change;
      this._lastUpdate.value = trade.created_at;
      if (new Date(trade.trade_date).getTime() !== 0) {
        this._lastTradeDate.value = trade.trade_date;
      }
      if (this._lastTrade != null) {
        this._marketValue.value = this._quantity * this._lastTrade;
        this._gainLoss.value    = this._marketValue - this._cost;
      }
      if (this._priceChange != null) {
        this._dayChange.value = this._quantity * this._priceChange;
      }
    }
  }

  // If position strings are valid, returns null. Otherwise, returns error message.
  static validateStringInput(position, cb) {
    let errorReturn = null;
    if (!(/^[A-Z.*+-]+$/.test(position.instrument_symbol))) {
      errorReturn = {name: 'instrument_symbol', message: 'Symbol is not valid.'};
    } else if (!(Number.parseFloat(position.quantity) >= 0)) {
      errorReturn = {name: 'quantity', message: 'Quantity must be greater than or equal to zero.'};
    } else if (position.cost < 0.0) {
      errorReturn = {name: 'cost', message: 'Cost must be greater than or equal to zero.'};
    } else if (Number.isNaN(Date.parse(position.date_acquired))) {
      errorReturn = {name: 'date_acquired', message: 'Date Acquired is not valid.'};
    }
    if (errorReturn === null) {
      // async validations should always come last.
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
