import * as ActionUtils from '../../actions/actionUtils';

// If position is valid, returns null. Otherwise, returns error message.
export function validate(position, cb) {
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
    ActionUtils.symbolSearch({field: 'name', value: this.state.editedPosition.stock_symbol_name, exact:true}, symbols => {
      if (symbols.length !== 1) {
        errorReturn = {name: 'stock_symbol_name', message: 'Symbol is not valid.'};
      }
    });
  }
  cb(errorReturn);
}

// class Position {
//   constructor(year, month, day) {
//     // Check that (year, month, day) is a valid date
//     // ...
//
//     // If it is, use it to initialize "this" date
//     this._year = year;
//     this._month = month;
//     this._day = day;
//   }
//
//   addDays(nDays) {
//     // Increase "this" date by n days
//     // ...
//   }
//
//   getDay() {
//     return this._day;
//   }
// }
