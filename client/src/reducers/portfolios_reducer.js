export default function portfoliosReducer(state= {creatingPortfolio: false, loadingPortfolios: false, removingPortfolio: false, updatingPortfolio: false, portfolios: []}, action) {
// console.log("ACTION type: " + action.type + " pl: " + action.payload + " STATE: " + JSON.stringify(state));
  let index, portfolios;
  switch ( action.type ) {
    // Add a Portfolio
    case 'CREATING_PORTFOLIO':
      return Object.assign({}, state, {creatingPortfolio: true})
    case 'CREATE_PORTFOLIO':
      portfolios = [action.payload.portfolio, ...state.portfolios];
      return Object.assign({}, state, {creatingPortfolio: false, portfolios: portfolios})

    // Load Portfolios
    case 'LOADING_PORTFOLIOS':
      return Object.assign({}, state, {loadingPortfolios: true})
    case 'LOAD_PORTFOLIOS':
      return Object.assign({}, state, {loadingPortfolios: false, portfolios: action.payload})

    // Delete a Portfolio
    case 'DELETING_PORTFOLIO':
      return Object.assign({}, state, {removingPortfolio: true})
    case 'DELETE_PORTFOLIO':
      index = action.payload;
      portfolios = [...state.portfolios.slice(0,index), ...state.portfolios.slice(index+1)]
      return Object.assign({}, state, {removingPortfolio: false, portfolios: portfolios})

    // Update a Portfolio
    case 'UPDATING_PORTFOLIO':
      return Object.assign({}, state, {updatingPortfolio: true})
    case 'UPDATE_PORTFOLIO':
      index = action.payload.index;
      portfolios = [...state.portfolios.slice(0,index), action.payload.portfolio, ...state.portfolios.slice(index+1)]
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios})

    default:
      console.log("UNKNOWN PORTFOLIO ACTION");
      return state;
  }
}
