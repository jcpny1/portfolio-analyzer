import React from 'react';

// This class is used to hold and format numeric values.
export default class Decimal {
  // Valid types are currency, decimal, index, and quantity.
  constructor(valueStr = '+0.0', type = '', delta = '') {
    const inputValue = parseFloat(valueStr);
    this._value = Math.sign(inputValue) === -0.0 ? +0.0 : inputValue;  // We don't need or want -0 values.
    this._type  = type;
    this._delta = delta;
  }

  get value() { return this._value }
  set value(newValue) { this._value = parseFloat(newValue) }
  valueOf() { return this._value }

  // Convert a local decimal string to the en-US allowed by javascript.
  //   Remove thousands group character. Swap out decimal character.
  //   Some of this logic can be replaced with Intl.NumberFormat.prototype.formatToParts(number), when it becomes available.
  static fromLocale = (stringValue, locale) => {
    const testString = new Intl.NumberFormat(locale).format(1000.1); // => e.g. '1.000,1'
    const groupChar = testString[1];
    const decimalChar = testString[5]
    const re = new RegExp(`(d+)([${groupChar}${decimalChar}])`, 'g');
    return stringValue.replace(re, function(match, p1, p2) {
      const newP2 = (p2 === groupChar) ? '' : (p2 === decimalChar) ? '.' : p2;
      return `${p1}${newP2}`
    });
  }

  // Returns the formatted value string with HTML code.
  toHTML(locale = 'en-US', useColor = '' ) {
    const stringValue = this.toString(locale)
    let color = '';
    let sign  = '';
    if (useColor) {
      color = useColor;
    } else if (this._value < 0.0) {
      color = 'red';  // Note: formatted negative numbers already have a sign.
    } else if (this._value > 0.0 && this._delta) {
      color = 'green';
      sign  = '+';
    } else {
      color = 'black';
    }
    return (<span style={{color:color}}>{sign}{stringValue}</span>);
  }

  // Returns a formatted value string.
  toString(locale = 'en-US') {
    let formattedValue = '';
    if (this._value) {
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
      formattedValue = this._value.toLocaleString(locale, options);
    }
    return formattedValue;
  }
}
