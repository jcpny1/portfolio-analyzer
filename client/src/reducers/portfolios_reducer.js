import Fmt from '../components/Formatters';

export const portfolioActions = {
  ADD_PORTFOLIO:      'ADD_PORTFOLIO',
  DELETE_PORTFOLIO:   'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS:   'ERROR_PORTFOLIOS',
  LOAD_PORTFOLIOS:    'LOAD_PORTFOLIOS',
  SORT_PORTFOLIOS:    'SORT_PORTFOLIOS',
  UPDATE_PORTFOLIO:   'UPDATE_PORTFOLIO',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',

  ADD_POSITION:       'ADD_POSITION',
  DELETE_POSITION:    'DELETE_POSITION',
  SORT_POSITIONS:     'SORT_POSITIONS',
  UPDATE_POSITION:    'UPDATE_POSITION',
};

export function addPortfolioAction(payload)    {return {type: portfolioActions.ADD_PORTFOLIO,    payload: payload};}
export function deletePortfolioAction(payload) {return {type: portfolioActions.DELETE_PORTFOLIO, payload: payload};}
export function errorPortfolioAction(payload)  {return {type: portfolioActions.ERROR_PORTFOLIOS, payload: payload};}
export function loadPortfoliosAction(payload)  {return {type: portfolioActions.LOAD_PORTFOLIOS,  payload: payload};}
export function sortPortfoliosAction(payload)  {return {type: portfolioActions.SORT_PORTFOLIOS,  payload: payload};}
export function updatePortfolioAction(payload) {return {type: portfolioActions.UPDATE_PORTFOLIO, payload: payload};}
export function updatingPortfolioAction()      {return {type: portfolioActions.UPDATING_PORTFOLIO};}

export function addPositionAction(payload)    {return {type: portfolioActions.ADD_POSITION,    payload: payload};}
export function deletePositionAction(payload) {return {type: portfolioActions.DELETE_POSITION, payload: payload};}
export function sortPositionsAction(payload)  {return {type: portfolioActions.SORT_POSITIONS,  payload: payload};}
export function updatePositionAction(payload) {return {type: portfolioActions.UPDATE_POSITION, payload: payload};}

export function portfoliosReducer(state= {updatingPortfolios: false, portfolios: []}, action) {
  // A generic sort comparator function.
  var sort_by = function(field, reverse = false, compareFn) {
    var key = function (x) {return compareFn ? compareFn(x[field]) : x[field]};
    return function (a,b) {
  	  var A = key(a), B = key(b);
      return ( ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [1,-1][+!!reverse] );
    }
  }

console.log("ACTION: " + action.type);
  switch ( action.type ) {

    // *************************
    // >>> PORTFOLIO ACTIONS <<<
    // *************************

    // Add a Portfolio.
    case portfolioActions.ADD_PORTFOLIO: {
      const portfolios = [action.payload, ...state.portfolios];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Delete a Portfolio.
    case portfolioActions.DELETE_PORTFOLIO: {
      const payloadPortfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolioId;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Error on Portfolio action.
    case portfolioActions.ERROR_PORTFOLIOS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPortfolios: false});
    }

    // Load Portfolios.
    case portfolioActions.LOAD_PORTFOLIOS: {
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: action.payload});
    }

    // Sort Portfolios.
    case portfolioActions.SORT_PORTFOLIOS: {
      const portfolios = [...state.portfolios];
      if (portfolios.length === 0) {
        return state;
      }
      const {columnName, reverseSort} = action.payload;
      switch (columnName) {
        case 'name':
          portfolios.sort(sort_by(columnName, reverseSort, function(a){return a.toUpperCase()}));
          break;
        case 'gainLoss':     // fall through
        case 'marketValue':  // fall through
        case 'totalCost':
          portfolios.sort(sort_by(columnName, reverseSort, parseFloat));
          break;
        default:
          portfolios.sort(sort_by(columnName, reverseSort));
          break;
      }
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Update a Portfolio.
    case portfolioActions.UPDATE_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Show that one or more Portfolios are being modified.
    case portfolioActions.UPDATING_PORTFOLIO:   // fall through
    case portfolioActions.UPDATING_POSITION:
      return Object.assign({}, state, {updatingPortfolios: true});

    // **********************************
    // >>> PORTFOLIO POSITION ACTIONS <<<
    // **********************************

    // Add a Position.
    case portfolioActions.ADD_POSITION: {
      const payloadPosition = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPosition.portfolio_id});
      let portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      portfolio.open_positions.push(payloadPosition);
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Delete a Position.
    case portfolioActions.DELETE_POSITION: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Sort Positions within a Portfolio.
    case portfolioActions.SORT_POSITIONS: {
      const {portfolio_id, columnName, reverseSort} = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === portfolio_id});
      const portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      switch (columnName) {
        case 'stock_symbol':
          portfolio.open_positions.sort(sort_by('stock_symbol', reverseSort, function(a){return a.name.toUpperCase()}));
          break;
        case 'date_acquired':
          portfolio.open_positions.sort(sort_by(columnName, reverseSort, parseInt));
          break;
        case 'cost':           // fall through
        case 'gainLoss':       // fall through
        case 'lastClosePrice': // fall through
        case 'marketValue':    // fall through
        case 'quantity':
          portfolio.open_positions.sort(sort_by(columnName, reverseSort, parseFloat));
          break;
        default:
          portfolio.open_positions.sort(sort_by(columnName, reverseSort));
          break;
      }
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Update a Position.
    case portfolioActions.UPDATE_POSITION: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Default action.
    default:
      return state;
  }
}

// const PortfolioReducerFunctions = {
//   portfoliosReducer,
//   addPortfolioAction, deletePortfolioAction, errorPortfolioAction, loadPortfoliosAction, sortPortfoliosAction, updatePortfolioAction, updatingPortfolioAction,
//   addPositionAction,  deletePositionAction,  sortPositionsAction
// };
//
// export default PortfolioReducerFunctions;
