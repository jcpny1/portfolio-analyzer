import React from 'react';

// This class is used to hold and format numeric values.
export default class DateTime {
  static dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

  // Valid types are currency, decimal, index, and quantity.
  constructor(valueStr = '') {
    this.value = valueStr;
  }

  get value() {return this._value}
  set value(valueStr = '') {
    this._value = new Date(valueStr);
  }
  valueOf() {return this._value}

  // Returns the formatted value string with HTML code.
  toHTML(locale = 'en-US', useColor = '' ) {
    const stringValue = this.toString(locale)
    let color = useColor ? useColor : 'black';
    return (<span style={{color:color}}>{stringValue}</span>);
  }

  // Returns a formatted value string.
  toString(locale = 'en-US') {
    const dateFormat = new Intl.DateTimeFormat(locale, DateTime.dateOptions);
    return this._value ? dateFormat.format(this._value).replace(',', '') : '';
  }
}
