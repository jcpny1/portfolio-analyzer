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
    } else {
      ActionUtils.symbolSearch({field: 'name', value: position.stock_symbol_name, exact:true}, symbols => {
        if (symbols.length !== 1) {
          errorReturn = {name: 'stock_symbol_name', message: 'Symbol is not valid.'};
        }
      });
    }
    cb(errorReturn);
  }
}
