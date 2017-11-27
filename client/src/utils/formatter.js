import React from 'react';

const locale = 'en-US';
const dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
const dateFormat = new Intl.DateTimeFormat(locale, dateOptions);

// Returns a formatted DateTime string.
const dateTime = (props) => {
  return (props.value) ? dateFormat.format(new Date(props.value)).replace(',', '') : '';
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

const Fmt = {dateTime, serverError, symbol};
export default Fmt;
