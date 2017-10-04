// Returns a formatted currency string from a decimal string value.
export function formatCurrency(value) {
  return parseFloat(value).toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
}
