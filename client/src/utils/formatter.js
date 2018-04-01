// Returns a formatted server error string.
const serverError = (prefix, error) => {
  const dateOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateStamp   = new Intl.DateTimeFormat(undefined, dateOptions).format(Date.now());
  const errorString = (error.status === 400 || error.status === 500) ?
      `${prefix}: status: ${error.status} error: ${error.error}: ${error.exception} @ ${error.traces['Application Trace'][0].trace}` :
      `${prefix}: ${error}`;
      return `${errorString}\n\n\n${dateStamp}`;
};

// If string is longer than length len, truncate it and add an ellipsis.
const truncate = (string, len) => {
  return (string.length > len) ? string.substr(0, len-1) + '...' : string;
}

const Fmt = {serverError, truncate};
export default Fmt;
