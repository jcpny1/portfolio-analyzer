import DateTime from '../classes/DateTime';
import Decimal from '../classes/Decimal';
import Instrument from '../classes/Instrument';
import Trade from '../classes/Trade';
import * as Request from '../utils/request';

export default class Position {
  constructor(portfolioId, id = '', quantity = '', cost = '', dateAcquired = '') {
    // persisted
    this._portfolio_id  = portfolioId;
    this._id            = id;
    this._cost          = new Decimal(cost, 'currency');
    this._dateAcquired  = new DateTime(dateAcquired);
    this._instrument    = new Instrument();
    this._quantity      = new Decimal(quantity, 'quantity');
    this._trade         = new Trade();  // from market data
    this.updateDerivedValues();         // derived
  }

  get cost()          {return this._cost}
  get dateAcquired()  {return this._dateAcquired}
  get dayChange()     {return this._dayChange}
  get gainLoss()      {return this._gainLoss}
  get id()            {return this._id}
  get instrument()    {return this._instrument}
  get lastTrade()     {return this._trade.price}
  get lastUpdate()    {return this._trade.lastUpdate}
  get lastTradeDate() {return this._trade.tradeDate}
  get marketValue()   {return this._marketValue}
  get pctTotalMV()    {return this._pctTotalMV}
  get portfolio_id()  {return this._portfolio_id}
  get priceChange()   {return this._trade.priceChange}
  get quantity()      {return this._quantity}

  set cost(cost)                 {this._cost          = new Decimal(cost, 'currency')}
  set dateAcquired(dateAcquired) {this._dateAcquired  = new DateTime(dateAcquired)}
  set instrument(instrument)     {this._instrument    = instrument}
  set pctTotalMV(pctTotalMV)     {this._pctTotalMV    = new Decimal(pctTotalMV, 'percent')}
  set quantity(quantity)         {this._quantity      = new Decimal(quantity, 'quantity')}

  reprice(serverTrades) {
    const serverTrade = serverTrades.find(serverTrade => serverTrade.attributes['instrument-id'].toString() === this._instrument.id);
    if (serverTrade) {
      this._trade = new Trade(this._instrument.id,
                              serverTrade.attributes['trade-price'],
                              serverTrade.attributes['price-change'],
                              serverTrade.attributes['trade-date'],
                              serverTrade.attributes['created-at']);
      this.updateDerivedValues();
    }
  }

  // Recompute position summary info.
  updateDerivedValues() {
    this._dayChange   = new Decimal(this.quantity * this.priceChange, 'currency', 'delta');
    this._marketValue = new Decimal(this.quantity * this.lastTrade, 'currency');
    this._gainLoss    = new Decimal(this.marketValue - this.cost, 'currency', 'delta');
    this._pctTotalMV  = new Decimal(0.0, 'percent');
  }

  // If position strings are valid, returns null. Otherwise, returns error message.
  static validateStringInput(position, cb) {
    let errorReturn = null;
    if (!(/^[A-Z.*+-]+$/.test(position.symbol))) {
      errorReturn = {name: 'symbol', message: 'Symbol is not valid.'};
    } else if (Number.isNaN(parseFloat(position.quantity)) || !isFinite(position.quantity)) {
      errorReturn = {name: 'quantity', message: 'Quantity must be a number.'};
    } else if (!(Number.parseFloat(position.quantity) >= 0)) {
      errorReturn = {name: 'quantity', message: 'Quantity must be greater than or equal to zero.'};
    } else if (Number.isNaN(parseFloat(position.cost)) || !isFinite(position.cost)) {
      errorReturn = {name: 'cost', message: 'Cost must be a number.'};
    } else if (position.cost < 0.0) {
      errorReturn = {name: 'cost', message: 'Cost must be greater than or equal to zero.'};
    } else if (Number.isNaN(Date.parse(position.dateAcquired))) {
      errorReturn = {name: 'dateAcquired', message: 'Date Acquired is not valid.'};
    }
    if (errorReturn === null) {
      // async validations should always come last.
      Request.instrumentSearch({value: position.symbol, exact:true}, instruments => {
        if (instruments.data.length !== 1) {
          errorReturn = {name: 'symbol', message: 'Symbol is not valid.'};
        }
        cb(errorReturn);
      });
    } else {
      cb(errorReturn);
    }
  }
}
