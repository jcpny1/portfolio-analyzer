import Fmt from '../components/Formatters';

export const portfolioActions = {
  ADD_PORTFOLIO     : 'ADD_PORTFOLIO',
  DELETE_PORTFOLIO  : 'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS  : 'ERROR_PORTFOLIOS',
  UPDATE_PORTFOLIO  : 'UPDATE_PORTFOLIO',
  UPDATE_PORTFOLIOS : 'UPDATE_PORTFOLIOS',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',

  ADD_POSITION      : 'ADD_POSITION',
  DELETE_POSITION   : 'DELETE_POSITION',
  UPDATE_POSITION   : 'UPDATE_POSITION',
};

export function updatingPortfolioAction()        {return {type: portfolioActions.UPDATING_PORTFOLIO}}

export function addPortfolioAction     (payload) {return {type: portfolioActions.ADD_PORTFOLIO,     payload: payload}}
export function deletePortfolioAction  (payload) {return {type: portfolioActions.DELETE_PORTFOLIO,  payload: payload}}
export function errorPortfolioAction   (payload) {return {type: portfolioActions.ERROR_PORTFOLIOS,  payload: payload}}
export function updatePortfolioAction  (payload) {return {type: portfolioActions.UPDATE_PORTFOLIO,  payload: payload}}
export function updatePortfoliosAction (payload) {return {type: portfolioActions.UPDATE_PORTFOLIOS, payload: payload}}

export function addPositionAction      (payload) {return {type: portfolioActions.ADD_POSITION,      payload: payload}}
export function deletePositionAction   (payload) {return {type: portfolioActions.DELETE_POSITION,   payload: payload}}
export function updatePositionAction   (payload) {return {type: portfolioActions.UPDATE_POSITION,   payload: payload}}


// TODO Dup from portfolioActions
function recomputePortfolioSummary(portfolio) {
  portfolio.marketValue = 0.0;
  portfolio.totalCost   = 0.0;
  portfolio.gainLoss    = 0.0;
  portfolio.open_positions.forEach(function(position) {
    portfolio.marketValue  += position.marketValue;
    portfolio.totalCost    += position.cost;
    portfolio.gainLoss     += position.gainLoss;
  });
}


export function portfoliosReducer(state= {updatingPortfolio: false, portfolios: []}, action) {

  console.log("ACTION: " + action.type);

  switch ( action.type ) {

    // *************************
    // >>> PORTFOLIO ACTIONS <<<
    // *************************

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

    // Update a Portfolio.
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

    // **********************************
    // >>> PORTFOLIO POSITION ACTIONS <<<
    // **********************************

    // Add a Position to a Portfolio.
    case portfolioActions.ADD_POSITION: {
      const payloadPosition = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPosition.portfolio_id});
      let portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      portfolio.open_positions.push(payloadPosition);
      recomputePortfolioSummary(portfolio);
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Delete a Position from a Portfolio.
    case portfolioActions.DELETE_POSITION: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      recomputePortfolioSummary(payloadPortfolio);
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Update a Position in a Portfolio.
    case portfolioActions.UPDATE_POSITION: {
      const payloadPosition = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPosition.portfolio_id});
      let portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      const positionIndex = portfolio.open_positions.findIndex(position => {return position.id === payloadPosition.id});
      portfolio.open_positions = [...portfolio.open_positions.slice(0,positionIndex), payloadPosition, ...portfolio.open_positions.slice(positionIndex+1)];
      recomputePortfolioSummary(portfolio);
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Default action.
    default:
      return state;
  }
}
