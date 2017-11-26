import React from 'react';

export default class Currency {
  constructor(value = 0.0, delta = '') {
    const inputValue = parseFloat(value);
    this._value  = Math.sign(inputValue) === -0 ? +0.0 : inputValue;  // We don't need or want -0 values.
    this._delta  = delta;
  }

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

  // Returns a formatted currency string.
  toString(locale = 'en-US') {
    const options = {style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:3};
    return this._value.toLocaleString(locale, options);
  }
}
