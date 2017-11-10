import React from 'react';

// Returns a formatted currency string.
// Specify prop delta for positive numbers to receive a plus sign and to format positive numbers as green.
// Specify prop color to force a particular color.
// TODO codify the zero test with a static function using a clearly defined constant.
const currency = (props) => {
  let value = parseFloat(props.value);
  const valueIsNotZero = Math.abs(value) > 0.00001;
  value = valueIsNotZero ? value : +0.0;  // We don't want to see a formatted 'negative zero'.
  const formattedValue = value.toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 3});
  let plus = '';
  let color = props.color || 'black';
  if (value < +0.0) {
    color = 'red';
  } else if (props.delta && valueIsNotZero) {
    plus  = '+';
    color = 'green';
  }
  return (<span style={{color:color}}>{plus}{formattedValue}</span>);
}

const locale = 'en-US';
const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
const dateFormat = new Intl.DateTimeFormat(locale, options);

// Returns a formatted DateTime string.
const dateTime = (props) => {
  return (props.value) ? dateFormat.format(new Date(props.value)).replace(',', '') : '';
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
