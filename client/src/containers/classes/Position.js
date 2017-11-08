import * as ActionUtils from '../../actions/actionUtils';
// Using a class to organize Position-related logic.
// It doesn't seem worth the effort to instantiate any Position objects, yet.
export default class Position {
  // Return an empty Position object.
  static newPosition(portfolioId='') {
    return ({
      portfolio_id: portfolioId,
      id: '',
      stock_symbol: {},
      quantity: '',
      cost: '',
      date_acquired: '',
    });
  }

  static processPrices(position, trades) {
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
  }

  // If position is valid, returns null. Otherwise, returns error message.
  static validate(position, cb) {
    let errorReturn = null;
    if (!(/^[A-Z.*+-]+$/.test(position.stock_symbol_name))) {
      errorReturn = {name: 'stock_symbol_name', message: 'Symbol is not valid.'};
    } else if (!(parseFloat(position.quantity) >= 0)) {
      errorReturn = {name: 'quantity', message: 'Quantity must be greater than or equal to zero.'};
    } else if (!(parseFloat(position.cost) >= 0)) {
      errorReturn = {name: 'cost', message: 'Cost must be greater than or equal to zero.'};
    } else if (isNaN(Date.parse(position.date_acquired))) {
      errorReturn = {name: 'date_acquired', message: 'Date Acquired is not valid.'};
    }
    if (errorReturn === null) {
      ActionUtils.symbolSearch({value: position.stock_symbol_name, exact:true}, symbols => {
        if (symbols.length !== 1) {
          errorReturn = {name: 'stock_symbol_name', message: 'Symbol is not valid.'};
        }
        cb(errorReturn);
      });
    } else {
      cb(errorReturn);
    }
  }
}
