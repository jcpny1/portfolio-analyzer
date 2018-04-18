import DateTime from '../classes/DateTime';
import Decimal from '../classes/Decimal';

export default class Trade {
  constructor(instrumentId = '', price = '', priceChange = '', tradeDate = '', lastUpdate = '') {
    this._instrumentId = instrumentId;
    this._price        = new Decimal(price, 'currency');
    this._priceChange  = new Decimal(priceChange, 'currency', 'delta');
    this._tradeDate    = new DateTime(tradeDate);
    this._lastUpdate   = new DateTime(lastUpdate);
  }
}
