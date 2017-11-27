import React from 'react';

// This class is used to hold and format numeric values.
export default class Decimal {
  // Valid types are currency, decimal, index, and quantity.
  constructor(value = '+0.0', type = '', delta = '') {
    const inputValue = parseFloat(value);
    this._value = Math.sign(inputValue) === -0 ? +0.0 : inputValue;  // We don't need or want -0 values.
    this._type  = type;
    this._delta = delta;
  }

  // Returns the formatted value string with HTML code.
  toHTML(locale = 'en-US', useColor = '' ) {
    const stringValue = this.toString(locale)
    let color = '';
    let plus  = '';
    if (useColor) {
      color = useColor;
    } else if (this._value < 0.0) {
      color = 'red';
    } else if (this._delta && this._value > 0) {
      plus  = '+';
      color = 'green';
    } else {
      color = 'black';
    }
    return (<span style={{color:color}}>{plus}{stringValue}</span>);
  }

  get value() {
      return this._value;
  }

  set value(newValue) {
      this._value = parseFloat(newValue);
  }

  valueOf() {
    return this._value;
  }

  // Returns a formatted value string.
  toString(locale = 'en-US') {
    let options = {};
    switch (this._type) {
      case 'currency':
        options = {style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:3};
        break;
      case 'decimal':
        options = {minimumFractionDigits:2, maximumFractionDigits:3};
        break;
      case 'index':
        options = {minimumFractionDigits:0, maximumFractionDigits:2};
        break;
      case 'quantity':
        options = {minimumFractionDigits:0, maximumFractionDigits:5};
        break;
      default:
        break;
    }
    return this._value.toLocaleString(locale, options);
  }
}
