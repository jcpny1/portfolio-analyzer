// Check a fetch response status.
function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.log(error);
  }
  return response;
}

// Call the appropriate action function to sort an array by column name.
var columnSorter = (function (sortAction) {
  var lastSortColumn  = '';     // which column was last sorted.
  var lastSortReverse = false;  // was the last sort a reverse sort?
    return function (array, columnName) {
      let reverseSort = lastSortReverse;
      if (lastSortColumn !== columnName) {
        lastSortColumn = columnName;
        reverseSort = false;
      } else {
        reverseSort = !reverseSort;
      }
      sortAction(array, columnName, reverseSort);
      lastSortReverse = reverseSort;
    }
});

// A generic sort comparator function.
var sort_by = function(field, reverse = false, compareFn) {
  var key = function (x) {return compareFn ? compareFn(x[field]) : x[field]};
  return function (a,b) {
    var A = key(a), B = key(b);
    return ( ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [1,-1][+!!reverse] );
  }
}

const ActionUtils = {checkStatus, columnSorter, sort_by};
export default ActionUtils;
