import React from 'react';

// This class is used to hold and format numeric values.
export default class DateTime {
  static dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

  constructor(value = '') {
    const timestamp = Date.parse(value);
    this._value = isNaN(timestamp) ? new Date() : new Date(timestamp);
  }

  valueOf() {return this._value}
  // get value() {return this._value}
  // set value(valueStr = '') {
  //   this._value = new Date(valueStr);
  // }
  // valueOf() {return this._value.toISOString().substring(0, 10)}

  // Returns a date string formatted for Form input.
  toForm(dateValue) {
    return this._value.toISOString().substring(0, 10);
  }


  // Returns the formatted value string with HTML code.
  toHTML(locale, useColor = '' ) {
    const stringValue = this.toString(locale)
    let color = useColor ? useColor : 'black';
    return (<span style={{color:color}}>{stringValue}</span>);
  }

  // Returns a formatted value string.
  toString(locale) {
    let formattedValue = '';
    if (locale) {
      formattedValue = this.toStringFormatted(locale);
    } else {
      formattedValue = this._value.toString();
    }
    return formattedValue;
  }

  // Returns a formatted value string.
  toStringFormatted(locale) {
    const dateFormat = new Intl.DateTimeFormat(locale, DateTime.dateOptions);
    return this._value ? dateFormat.format(this._value).replace(',', '') : '';
  }
}
