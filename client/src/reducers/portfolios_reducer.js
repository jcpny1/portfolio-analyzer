import Fmt from '../utils/Formatters';

export const portfolioActions = {
  ADD_PORTFOLIO:      'ADD_PORTFOLIO',
  DELETE_PORTFOLIO:   'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS:   'ERROR_PORTFOLIOS',
  LOAD_PORTFOLIOS:    'LOAD_PORTFOLIOS',
  UPDATE_PORTFOLIOS:  'UPDATE_PORTFOLIOS',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',
  ADD_POSITION:       'ADD_POSITION',
  DELETE_POSITION:    'DELETE_POSITION',
  ERROR_POSITIONS:    'ERROR_POSITIONS',
  UPDATE_POSITIONS:   'UPDATE_POSITIONS',
  UPDATING_POSITION:  'UPDATING_POSITION',
};

export default function portfoliosReducer(state= {updatingPortfolios: false, portfolios: []}, action) {
// console.log("ACTION type: " + action.type + " payload: " + action.payload + " STATE: " + JSON.stringify(state));
  let portfolios, portfolio, portfolioIndex, payloadPosition, payloadPortfolio;

  switch ( action.type ) {
    // ************************* //
    // *** PORTFOLIO ACTIONS *** //
    // ************************* //

    // Add a Portfolio.
    case portfolioActions.ADD_PORTFOLIO:
      portfolios = [action.payload, ...state.portfolios];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

    // Delete a Portfolio.
    case portfolioActions.DELETE_PORTFOLIO:
      payloadPortfolio = action.payload;
      portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

    // Error on Portfolio action.
    case portfolioActions.ERROR_PORTFOLIOS: {
      const {prefix, error} = action.payload;
      alert(Fmt.formatServerError(prefix, error));
      return Object.assign({}, state, {updatingPortfolios: false});
    }

    // Load Portfolios.
    case portfolioActions.LOAD_PORTFOLIOS:
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: action.payload});

    // Update a Portfolio.
    case portfolioActions.UPDATE_PORTFOLIOS:
      payloadPortfolio = action.payload;
      portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

    // Show one or more Portfolios are being modified.
    case portfolioActions.UPDATING_PORTFOLIO:
      return Object.assign({}, state, {updatingPortfolios: true});

      // ********************************** //
      // *** PORTFOLIO POSITION ACTIONS *** //
      // ********************************** //

      // Update a Position.
    case portfolioActions.ADD_POSITION:
      payloadPortfolio = action.payload;
      portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

    // Delete a Position.
    case portfolioActions.DELETE_POSITION:
      payloadPosition = action.payload;
      portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPosition.portfolio_id;});
      portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      portfolio.open_positions = state.portfolios[portfolioIndex].open_positions.filter(open_position => open_position.id !== payloadPosition.id);
      portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

      // Error on Position action.
      case portfolioActions.ERROR_POSITIONS: {
        const {prefix, error} = action.payload;
        alert(Fmt.formatServerError(prefix, error));
        return Object.assign({}, state, {updatingPortfolios: false});
      }

    // Update a Position.
    case portfolioActions.UPDATE_POSITIONS:
      payloadPortfolio = action.payload;
      portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

    // Show one or more Portfolios are being modified.
    case portfolioActions.UPDATING_POSITION:
      return Object.assign({}, state, {updatingPortfolios: true});

    // Default action.
    default:
      return state;
  }
}
