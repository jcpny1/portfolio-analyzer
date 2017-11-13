import React from 'react';

const locale = 'en-US';
const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
const dateFormat = new Intl.DateTimeFormat(locale, options);

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
// TODO codify the zero test with a static function using a clearly defined constant.
const number = (props) => {
  // Determine if props.value is effectively zero or not.
  let value = parseFloat(props.value);
  const valueIsNotZero = Math.abs(value) > 0.00001;
  value = valueIsNotZero ? value : +0.0;  // We don't want to see a formatted 'negative zero'.

  // Set formatting options.
  let options = {};
  switch (props.type) {
    case 'currency':
      options = {style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:3};
      break;
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

  // Format the value.
  const formattedValue = value.toLocaleString(undefined, options);

  // Format for plus sign and color.
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

// Returns a formatted server error string.
const serverError = (error, prefix) => {
  const errorString = (error.status === 500) ?
    `${prefix} status: ${error.status} error: ${error.error}: ${error.exception}  @ ${error.traces['Application Trace'][0].trace}` :
    `${prefix}${error}`;
  return `${errorString}\n\n\n${Fmt.dateTime({value:Date.now()})}`;
}

const Fmt = {dateTime, index, number, serverError};
export default Fmt;
