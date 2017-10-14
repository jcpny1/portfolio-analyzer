export default function portfoliosReducer(state= {updatingPortfolios: false, portfolios: []}, action) {
// console.log("ACTION type: " + action.type + " pl: " + action.payload + " STATE: " + JSON.stringify(state));
  let index, portfolios, portfolio, position, portfolioIndex, portfolioPositionIndex, payloadPosition;

  switch ( action.type ) {
    // Add a Portfolio
    case 'CREATING_PORTFOLIO':
      return Object.assign({}, state, {updatingPortfolios: true})
    case 'CREATE_PORTFOLIO':
      portfolios = [action.payload.portfolio, ...state.portfolios];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios})

    // Delete a Portfolio
    case 'DELETING_PORTFOLIO':
      return Object.assign({}, state, {updatingPortfolios: true})
    case 'DELETE_PORTFOLIO':
      index = action.payload;
      portfolios = [...state.portfolios.slice(0,index), ...state.portfolios.slice(index+1)]
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios})

    // Load Portfolios
    case 'LOADING_PORTFOLIOS':
      return Object.assign({}, state, {updatingPortfolios: true})
    case 'LOAD_PORTFOLIOS':
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: action.payload})

    // Update a Portfolio
    case 'UPDATING_PORTFOLIO':
      return Object.assign({}, state, {updatingPortfolios: true})
    case 'UPDATE_PORTFOLIO':
      index = action.payload.index;
      portfolios = [...state.portfolios.slice(0,index), action.payload.portfolio, ...state.portfolios.slice(index+1)]
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios})

    // Add or Update a Position
    case 'UPDATING_POSITION':
      return Object.assign({}, state, {updatingPortfolios: true})
    case 'UPDATE_POSITION':
      payloadPosition = action.payload;
      portfolioIndex = state.portfolios.findIndex((portfolio) => {return portfolio.id === payloadPosition.portfolio_id;});
      portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      portfolioPositionIndex = portfolio.open_positions.findIndex((open_position) => {return open_position.id === payloadPosition.id;});
      portfolio.open_positions = [...portfolio.open_positions.slice(0,portfolioPositionIndex), payloadPosition, ...portfolio.open_positions.slice(portfolioPositionIndex+1)]
      portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});

    default:
      return state;
  }
}
