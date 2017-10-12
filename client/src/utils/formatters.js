// Returns a formatted currency string.
export function formatCurrency(value) {
  return parseFloat(value).toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Returns a formatted quantity string.
export function formatQuantity(value) {
  return parseFloat(value).toLocaleString(undefined, {style:'decimal', minimumFractionDigits: 0, maximumFractionDigits: 5});
}
