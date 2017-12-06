import DateTime from '../classes/DateTime';
import Decimal from '../classes/Decimal';
import Instrument from '../classes/Instrument';
import * as Request from '../utils/request';

export default class Position {
  constructor(portfolioId, id = '', instrument = {id: '', symbol: '', name: ''}, quantity = '', cost = '', dateAcquired = '') {
    // persisted
    this._portfolio_id  = portfolioId;
    this._id            = id;
    this.instrument     = instrument;
    this.quantity       = quantity;
    this.cost           = cost;
    this._dateAcquired  = new DateTime(dateAcquired);
    // from market data
    this._lastTrade     = new Decimal(0.0, 'currency');
    this._lastTradeDate = new DateTime();
    this._priceChange   = new Decimal(0.0, 'currency', 'delta');
    this._lastUpdate    = new DateTime();
    // derived
    this.updateDerivedValues();
  }

  get cost()          {return this._cost}
  get dateAcquired()  {return this._dateAcquired}
  get dayChange()     {return this._dayChange}
  get gainLoss()      {return this._gainLoss}
  get id()            {return this._id}
  get instrument()    {return this._instrument}
  get lastTrade()     {return this._lastTrade}
  get lastUpdate()    {return this._lastUpdate}
  get lastTradeDate() {return this._lastTradeDate}
  get marketValue()   {return this._marketValue}
  get portfolio_id()  {return this._portfolio_id}
  get priceChange()   {return this._priceChange}
  get quantity()      {return this._quantity}

  set cost(cost)                 {this._cost          = new Decimal(cost, 'currency')}
  set dateAcquired(dateAcquired) {this._dateAcquired  = new DateTime(dateAcquired)}
  set instrument(instrument)     {this._instrument    = new Instrument(instrument.id, instrument.symbol, instrument.name)}
  set quantity(quantity)         {this._quantity      = new Decimal(quantity, 'quantity')}

  //
  // set cost(cost)                   {this._cost          = cost}
  // set costString(cost)             {this._cost          = }
  //
  // set dateAcquired(dateAcquired) {this._dateAcquired = dateAcquired}
  // set dateAcquired_string(dateAcquired) {this._dateAcquired = }
  //
  // set instrument(instrument)       {this._instrument    = instrument}
  // set instrumentString(instrument) {this._instrument    = }
  //
  // set quantity(quantity)           {this._quantity      = quantity}
  // set quantityString(quantity)     {this._quantity      = }

  reprice(trades) {
    const trade = trades.find(trade => trade.instrument_id === this._instrument.id);
    if (trade) {
      this._lastTrade     = new Decimal(trade.trade_price, 'currency');
      this._priceChange   = new Decimal(trade.price_change, 'currency', 'delta');
      this._lastUpdate    = new DateTime(trade.created_at);
      this._lastTradeDate = new DateTime(trade.trade_date);
      this.updateDerivedValues();
    }
  }

  // Recompute position summary info.
  updateDerivedValues() {
    this._dayChange   = new Decimal(this._quantity * this._priceChange, 'currency', 'delta');
    this._marketValue = new Decimal(this._quantity * this._lastTrade, 'currency');
    this._gainLoss    = new Decimal(this._marketValue - this._cost, 'currency', 'delta');
  }

  // If position strings are valid, returns null. Otherwise, returns error message.
  static validateStringInput(position, cb) {
    let errorReturn = null;
    if (!(/^[A-Z.*+-]+$/.test(position.instrument.symbol))) {
      errorReturn = {name: 'instrument', message: 'Symbol is not valid.'};
    } else if (!(Number.parseFloat(position.quantity) >= 0)) {
      errorReturn = {name: 'quantity', message: 'Quantity must be greater than or equal to zero.'};
    } else if (position.cost < 0.0) {
      errorReturn = {name: 'cost', message: 'Cost must be greater than or equal to zero.'};
    } else if (Number.isNaN(Date.parse(position.dateAcquired))) {
      errorReturn = {name: 'dateAcquired', message: 'Date Acquired is not valid.'};
    }
    if (errorReturn === null) {
      // async validations should always come last.
      Request.instrumentSearch({value: position.instrument.symbol, exact:true}, instruments => {
        if (instruments.length !== 1) {
          errorReturn = {name: 'instrument', message: 'Symbol is not valid.'};
        }
        cb(errorReturn);
      });
    } else {
      cb(errorReturn);
    }
  }
}
