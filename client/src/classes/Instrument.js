import React from 'react';
import Fmt from '../utils/formatter';

// This class describes Instrument objects.
export default class Instrument {
  constructor(id = '', symbol = '', name = '') {
    this._id     = id;
    this._symbol = symbol;
    this._name   = name;
  }

  get id()     {return this._id}
  get name()   {return this._name}
  get symbol() {return this._symbol}

  // Returns the symbol string with HTML code.
  // Specify gainLoss number to determine color.
  symbolToHTML(gainLoss = +0.0) {
    const color = Fmt.valueColor(gainLoss);
    return (<span style={{color:color}}>{this._symbol}</span>);
  }
}
