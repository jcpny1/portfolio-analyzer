import React from 'react';
import Fmt from '../utils/formatter';

export default class Currency {
  constructor(value = 0.0, locale = 'de-DE') {
    this.value  = value;
    this.locale = locale;
  }

  toHtml() {
    return <Fmt.number type='currency' value={this.value} locale={this.locale}/>;
  }
}
