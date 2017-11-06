import React from 'react';

// Returns a formatted currency string.
// Specify prop plusSign for positive numbers to receive a plus sign.
const currency = (props) => {
  let result = '';
  if (props.value) {
    let formattedValue = parseFloat(props.value).toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 3});
    if (formattedValue[0] === '-') {
      result = <span style={{color:'red'}}>{formattedValue}</span>;
    } else {
      // TODO codify the zero test with a constant or a function based on significant fraction digits.
      if ((props.delta) && (props.value > 0.00001)) {
        result = <span style={{color:'green'}}>+{formattedValue}</span>;
      } else {
        result = <span style={{color:'black'}}>{formattedValue}</span>;
      }
    }
  }
  return result;
}

const locale = 'en-US';
const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
const dateFormat = new Intl.DateTimeFormat(locale, options);

// Returns a formatted DateTime string.
const dateTime = (props) => {
  return (props.value) ? dateFormat.format(new Date(props.value)) : '';
}

// Returns a formatted quantity string.
const quantity = (props) => {
  return (props.value) ? parseFloat(props.value).toLocaleString(undefined, {style:'decimal', minimumFractionDigits: 0, maximumFractionDigits: 5}) : '';
}

// Returns a formatted server error string.
const serverError = (error, prefix) => {
  return (error.status === 500) ?
    `${prefix} status: ${error.status} error: ${error.error}: ${error.exception}  @ ${error.traces['Application Trace'][0].trace}` :
    `${prefix}${error}`;
}

const Fmt = {currency, dateTime, quantity, serverError};
export default Fmt;
