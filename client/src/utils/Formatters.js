// Returns a formatted currency string.
function formatCurrency(value) {
  return parseFloat(value).toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Returns a formatted quantity string.
function formatQuantity(value) {
  return parseFloat(value).toLocaleString(undefined, {style:'decimal', minimumFractionDigits: 0, maximumFractionDigits: 5});
}

// Returns a formatted server error string.
function formatServerError(prefix, error) {
  if (error.status === 500) {
    return (`${prefix} status: ${error.status} error: ${error.error}: ${error.exception}  @ ${error.traces['Application Trace'][0].trace}`);
  } else {
    return (`${prefix}${error}`);
  }
}

const Fmt = {formatCurrency, formatQuantity, formatServerError};
export default Fmt;
