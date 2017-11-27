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

const Fmt = {dateTime, serverError};
export default Fmt;
