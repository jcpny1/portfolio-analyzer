import React from 'react';

// Returns a formatted currency string.
const Currency = (props) => {
  const formattedValue = parseFloat(props.value).toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
  let result = '';
  if (formattedValue[0] === '-') {
    result = <span style={{color:'red'}}>{formattedValue}</span>;
  } else {
    result = <span>{formattedValue}</span>;
  }
  return result;
}

// Returns a formatted quantity string.
const Quantity = (props) => {
  const formattedValue = parseFloat(props.value).toLocaleString(undefined, {style:'decimal', minimumFractionDigits: 0, maximumFractionDigits: 5});
  return <span>{formattedValue}</span>;
}

// Returns a formatted server error string.
const ServerError = (error, prefix) => {
  let formattedValue;
  if (error.status === 500) {
    formattedValue = `${prefix} status: ${error.status} error: ${error.error}: ${error.exception}  @ ${error.traces['Application Trace'][0].trace}`;
  } else {
    formattedValue = `${prefix}${error}`;
  }
  return formattedValue;
}

const Fmt = {Currency, Quantity, ServerError};
export default Fmt;
