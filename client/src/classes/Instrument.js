import React from 'react';

// This class describes Instrument objects.
export default class Instrument {
  constructor(id = '', symbol = '', name = '') {
    this._id     = id;
    this._symbol = symbol;
    this._name   = name;
  }

  get id()     {return this._id}
  get symbol() {return this._symbol}

  // Returns the symbol string with HTML code.
  //   Specify gainLoss number to determine color.
  toHTML(gainLoss = +0.0) {
    const gainLossSign = Math.sign(Number.parseFloat(gainLoss));
    let color = '';
    if (gainLossSign === 1) {
      color = 'green';
    } else if (gainLossSign === -1) {
      color = 'red';
    } else {
      color = 'black';
    }
    return (<span style={{color:color}}>{this._symbol}</span>);
  }
}
