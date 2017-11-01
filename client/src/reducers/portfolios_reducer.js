import Fmt from '../components/Formatters';
import ActionUtils from '../actions/actionUtils';

export const portfolioActions = {
  ADD_PORTFOLIO     : 'ADD_PORTFOLIO',
  DELETE_PORTFOLIO  : 'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS  : 'ERROR_PORTFOLIOS',
  SORT_POSITIONS    : 'SORT_POSITIONS',
  SORT_PORTFOLIOS   : 'SORT_PORTFOLIOS',
  UPDATE_PORTFOLIO  : 'UPDATE_PORTFOLIO',
  UPDATE_PORTFOLIOS : 'UPDATE_PORTFOLIOS',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',
};

export function addPortfolioAction(portfolio)      {return {type: portfolioActions.ADD_PORTFOLIO,     payload: portfolio}}
export function deletePortfolioAction(portfolioId) {return {type: portfolioActions.DELETE_PORTFOLIO,  payload: portfolioId}}
export function errorPortfolioAction(error)        {return {type: portfolioActions.ERROR_PORTFOLIOS,  payload: error}}
export function sortPositionsAction(sortInfo)      {return {type: portfolioActions.SORT_POSITIONS,    payload: sortInfo}}
export function sortPortfoliosAction(sortInfo)     {return {type: portfolioActions.SORT_PORTFOLIOS,   payload: sortInfo}}
export function updatePortfolioAction(portfolio)   {return {type: portfolioActions.UPDATE_PORTFOLIO,  payload: portfolio}}
export function updatePortfoliosAction(portfolios) {return {type: portfolioActions.UPDATE_PORTFOLIOS, payload: portfolios}}
export function updatingPortfolioAction()          {return {type: portfolioActions.UPDATING_PORTFOLIO}}

export function portfoliosReducer(state = {updatingPortfolio: false, portfolios: [], sorting: {portfolios: {sortFn: ActionUtils.columnSorter('Portfolio'), colName: 'name', colDirection: 'ascending'}, positions: {sortFn: ActionUtils.columnSorter('Position'), colName: 'stock_symbol', colDirection: 'ascending'}}}, action) {
  switch (action.type) {
    // Add a Portfolio.
    case portfolioActions.ADD_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      const portfolios = [payloadPortfolio, ...state.portfolios];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Delete a Portfolio.
    case portfolioActions.DELETE_PORTFOLIO: {
      const payloadPortfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolioId;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Error on Portfolio action.
    case portfolioActions.ERROR_PORTFOLIOS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPortfolio: false});
    }

    // Sort Portfolio Positions.
    //   payload: {portfolio: portfolio, colName: property, colDirection: sorting.colDirection}
    case portfolioActions.SORT_POSITIONS: {
      const {portfolio, colName, colDirection} = action.payload;
      const portfolioIndex = state.portfolios.findIndex(thisPortfolio => {return thisPortfolio.id === portfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      const sorting = Object.assign({}, state.sorting, {positions: {sortFn: state.sorting.positions.sortFn, colName: colName, colDirection: colDirection}});
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios, sorting: sorting});
    }

    // Sort Portfolios.
    //   payload: {portfolios: portfolios, colName: property, colDirection: sorting.colDirection}
    case portfolioActions.SORT_PORTFOLIOS: {
      const {portfolios, colName, colDirection} = action.payload;
      const sorting = Object.assign({}, state.sorting, {portfolios: {sortFn: state.sorting.portfolios.sortFn, colName: colName, colDirection: colDirection}});
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios, sorting: sorting});
    }

    // Update one Portfolio.
    case portfolioActions.UPDATE_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Update all Portfolios.
    case portfolioActions.UPDATE_PORTFOLIOS: {
      const payloadPortfolios = action.payload;
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: payloadPortfolios});
    }

    // Show that one or more Portfolios are being modified.
    case portfolioActions.UPDATING_PORTFOLIO:
      return Object.assign({}, state, {updatingPortfolio: true});

    // Default action.
    default:
      return state;
  }
}
