import Fmt from '../utils/formatter';
import * as Sort from '../utils/sort';

export const portfolioActions = {
  ADD_PORTFOLIO     : 'ADD_PORTFOLIO',
  DELETE_PORTFOLIO  : 'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS  : 'ERROR_PORTFOLIOS',
  UPDATE_PORTFOLIO  : 'UPDATE_PORTFOLIO',
  UPDATE_PORTFOLIOS : 'UPDATE_PORTFOLIOS',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',
  WARN_PORTFOLIOS   : 'WARN_PORTFOLIOS',
};

export function addPortfolioAction(portfolio)      {return {type: portfolioActions.ADD_PORTFOLIO,     payload: portfolio}}
export function deletePortfolioAction(portfolioId) {return {type: portfolioActions.DELETE_PORTFOLIO,  payload: portfolioId}}
export function errorPortfolioAction(error)        {return {type: portfolioActions.ERROR_PORTFOLIOS,  payload: error}}
export function updatePortfolioAction(portfolio)   {return {type: portfolioActions.UPDATE_PORTFOLIO,  payload: portfolio}}
export function updatePortfoliosAction(portfolios) {return {type: portfolioActions.UPDATE_PORTFOLIOS, payload: portfolios}}
export function updatingPortfolioAction()          {return {type: portfolioActions.UPDATING_PORTFOLIO}}
export function warnPortfolioAction(warning)       {return {type: portfolioActions.WARN_PORTFOLIOS,   payload: warning}}

export function portfoliosReducer(state = {updatingPortfolio: false, portfolios: [], sortFn: Sort.columnSorter('name', 'ascending', 'symbol', 'ascending')}, action) {
  let returnObject = {};
  switch (action.type) {
    // Add a Portfolio.
    case portfolioActions.ADD_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      const portfolios = [payloadPortfolio, ...state.portfolios];
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
      break;
    }

    // Delete a Portfolio.
    case portfolioActions.DELETE_PORTFOLIO: {
      const payloadPortfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolioId;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
      break;
    }

    // Error on Portfolio action.
    case portfolioActions.ERROR_PORTFOLIOS: {
      const {prefix, error} = action.payload;
      alert(Fmt.serverError(prefix, error));
      returnObject = Object.assign({}, state, {updatingPortfolio: false});
      break;
    }

    // Update one Portfolio.
    case portfolioActions.UPDATE_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
      break;
    }

    // Update all Portfolios.
    case portfolioActions.UPDATE_PORTFOLIOS: {
      const payloadPortfolios = action.payload;
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: payloadPortfolios});
      break;
    }

    // Show that one or more Portfolios are being modified.
    case portfolioActions.UPDATING_PORTFOLIO:
      returnObject = Object.assign({}, state, {updatingPortfolio: true});
      break;

    // Warning on Portfolio action.
    case portfolioActions.WARN_PORTFOLIOS: {
      const {prefix, warning} = action.payload;
      alert(Fmt.serverError(prefix, warning));
      returnObject = state;
      break;
    }

    // Default action.
    default:
      returnObject = state;
      break;
  }
  return returnObject;
}
