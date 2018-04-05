import React from 'react';

// This class is used to hold and format numeric values.
export default class Decimal {
  // Value can be a string or a number.
  // Valid types are currency, decimal, index, and quantity.
  // Specifying delta will affect the color of the displayed value.
  constructor(value = '', type = 'decimal', delta = '') {
    const floatValue = Number.parseFloat(value);
    this._value = (Math.sign(floatValue) === -0.0) ? +0.0 : floatValue;  // We don't need or want -0 values.
    this._type  = type;
    this._delta = delta;
  }

  valueOf() {return this._value}

  // Convert a locale-style decimal string to the en-US allowed by javascript.
  //   Remove thousands group character. Swap out decimal character.
  //   Some of this logic can be replaced with Intl.NumberFormat.prototype.formatToParts(number), when it becomes available.
  static fromLocale(stringValue, locale) {
    const testString = new Intl.NumberFormat(locale).format(1000.1); // => e.g. '1.000,1'
    const groupChar   = testString[1];
    const decimalChar = testString[5]
    const re = new RegExp(`(d+)([${groupChar}${decimalChar}])`, 'g');
    return stringValue.replace(re, function(match, p1, p2) {
      const newP2 = (p2 === groupChar) ? '' : (p2 === decimalChar) ? '.' : p2;
      return `${p1}${newP2}`
    });
  }

  // Returns the formatted value string with HTML code.
  toHTML(locale, useColor = '' ) {
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
  toString(locale) {
    let formattedValue = '';
    if (this._value) {
      if (locale) {
        formattedValue = this.toStringFormatted(locale);
      } else {
        formattedValue = this._value.toString();
      }
    }
    return formattedValue;
  }

  toStringFormatted(locale) {
    const options = {};
    switch (this._type) {
      case 'currency':
        options.style ='currency';
        options.currency = 'USD';
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = 3;
        break;
      case 'decimal':
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = 3;
        break;
      case 'index':
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 2;
        break;
      case 'percent':
        options.style ='percent';
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 2;
        break;
      case 'quantity':
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 5;
        break;
      default:
        break;
    }
    return this._value.toLocaleString(locale, options);
  }
}
