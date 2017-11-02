import Fmt from '../components/Formatters';
import ActionUtils from '../actions/actionUtils';

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

export function portfoliosReducer(state = {updatingPortfolio: false, portfolios: [], sortFn: ActionUtils.columnSorter('name', 'ascending', 'stock_symbol', 'ascending')}, action) {
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

    // Warning on Portfolio action.
    case portfolioActions.WARN_PORTFOLIOS: {
      const {warning, prefix} = action.payload;
      alert(Fmt.ServerError(warning, prefix));
      return state;
    }

    // Default action.
    default:
      return state;
  }
}
