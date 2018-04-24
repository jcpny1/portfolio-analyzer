import DateTime from '../classes/DateTime';
import Decimal from '../classes/Decimal';

export default class Trade {
  constructor(instrumentId = '', price = '', priceChange = '', tradeDate = '', lastUpdate = '') {
    this._instrumentId = instrumentId;
    this._lastUpdate   = new DateTime(lastUpdate);
    this._price        = new Decimal(price, 'currency');
    this._priceChange  = new Decimal(priceChange, 'currency', 'delta');
    this._tradeDate    = new DateTime(tradeDate);
  }

  get lastUpdate()     {return this._lastUpdate};
  get price()          {return this._price};
  get priceChange()    {return this._priceChange};
  get tradeDate()      {return this._tradeDate};
}
