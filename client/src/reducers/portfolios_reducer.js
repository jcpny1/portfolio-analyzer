import Fmt from '../utils/formatter';
import * as Sort from '../utils/sort';

const portfolioAction = {
  ADD       : 'PORTFOLIO_ADD',
  DELETE    : 'PORTFOLIO_DELETE',
  ERROR     : 'PORTFOLIOS_ERROR',
  UPDATE    : 'PORTFOLIO_UPDATE',
  UPDATE_ALL: 'PORTFOLIOS_UPDATE',
  UPDATING  : 'PORTFOLIO_UPDATING',
  WARN      : 'PORTFOLIOS_WARN',
};

export function addPortfolio(portfolio)        {return {type: portfolioAction.ADD,        payload: portfolio}}
export function deletePortfolio(portfolioId)   {return {type: portfolioAction.DELETE,     payload: portfolioId}}
export function errorPortfolio(error)          {return {type: portfolioAction.ERROR,      payload: error}}
export function updatePortfolio(portfolio)     {return {type: portfolioAction.UPDATE,     payload: portfolio}}
export function updateAllPortfolio(portfolios) {return {type: portfolioAction.UPDATE_ALL, payload: portfolios}}
export function updatingPortfolio()            {return {type: portfolioAction.UPDATING}}
export function warnPortfolio(warning)         {return {type: portfolioAction.WARN,       payload: warning}}

export function portfoliosReducer(state = {updatingPortfolio: false, portfolios: [], sortFn: Sort.columnSorter('name', 'ascending', 'symbol', 'ascending')}, action) {
  let returnObject = {};
  switch (action.type) {
    // Add a Portfolio.
    case portfolioAction.ADD: {
      const payloadPortfolio = action.payload;
      const portfolios = [payloadPortfolio, ...state.portfolios];
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
      break;
    }

    // Delete a Portfolio.
    case portfolioAction.DELETE: {
      const payloadPortfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolioId;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
      break;
    }

    // Error on Portfolio action.
    case portfolioAction.ERROR: {
      const {prefix, error} = action.payload;
      alert(Fmt.serverError(prefix, error));
      returnObject = Object.assign({}, state, {updatingPortfolio: false});
      break;
    }

    // Update one Portfolio.
    case portfolioAction.UPDATE: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
      break;
    }

    // Update all Portfolios.
    case portfolioAction.UPDATE_ALL: {
      const payloadPortfolios = action.payload;
      returnObject = Object.assign({}, state, {updatingPortfolio: false, portfolios: payloadPortfolios});
      break;
    }

    // Show that one or more Portfolios are being modified.
    case portfolioAction.UPDATING:
      returnObject = Object.assign({}, state, {updatingPortfolio: true});
      break;

    // Warning on Portfolio action.
    case portfolioAction.WARN: {
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
