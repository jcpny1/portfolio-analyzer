import React from 'react';

const locale = 'en-US';
const dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
const dateFormat = new Intl.DateTimeFormat(locale, dateOptions);

// Returns a formatted DateTime string.
const dateTime = (props) => {
  return (props.value) ? dateFormat.format(new Date(props.value)).replace(',', '') : '';
}

// Returns a formatted market index string.
const index = (name, values) => {
  return (
    <span>
      {name}: <Fmt.number type='index' value={values.price} color='darkorchid'/>&nbsp;<Fmt.number type='index' value={values.change} delta/>
    </span>
  );
}

// Returns a formatted number string.
//   Specify prop delta for positive numbers to receive a plus sign and green color.
//   Specify prop color to force a particular color.
//   Specify prop type to format for currency, decimal, index, or quantity.
const number = (props) => {
  // Determine if props.value is effectively zero or not.
  const locale = props.locale || 'eng-US';
  let value = parseFloat(props.value);
  const valueSign = Math.sign(value);
  if (valueSign === -0) {
    value = +0.0;  // We don't want to see a formatted 'negative zero'.
  }
  // Set formatting options.
  let options = {};
  switch (props.type) {
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
  // Format for plus sign and color.
  let color = '';
  let plus = '';
  if (props.color) {
    color = props.color;
  } else if (valueSign === -1) {
    color = 'red';
  } else if (props.delta && valueSign === 1) {
    plus  = '+';
    color = 'green';
  } else {
    color = 'black';
  }
  // Format the value itself.
  const formattedValue = value.toLocaleString(locale, options);
  // Return the formatted number string.
  return (<span style={{color:color}}>{plus}{formattedValue}</span>);
}

// Returns a formatted server error string.
const serverError = (error, prefix) => {
  const errorString = (error.status === 500) ?
    `${prefix} status: ${error.status} error: ${error.error}: ${error.exception}  @ ${error.traces['Application Trace'][0].trace}` :
    `${prefix}${error}`;
  return `${errorString}\n\n\n${Fmt.dateTime({value:Date.now()})}`;
}

// Returns a formatted symbol string.
//   Specify prop gainLoss to determine color.
const symbol = (props) => {
  // Determine if props.gl is effectively zero or not.
  let gainLoss = parseFloat(props.gainLoss);
  const gainLossSign = Math.sign(gainLoss);
  let color = '';
  if (gainLossSign === 1) {
    color = 'green';
  } else if (gainLossSign === -1) {
    color = 'red';
  } else {
    color = 'black';
  }
  return (<span style={{color:color}}>{props.value}</span>);
}

const Fmt = {dateTime, index, number, serverError, symbol};
export default Fmt;
