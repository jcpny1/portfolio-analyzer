export default function portfoliosReducer(state= {loadingPortfolios: false, portfolios: []}, action) {

  switch ( action.type ) {

    case 'LOADING_PORTFOLIOS':
      return Object.assign({}, state, {loadingPortfolios: true})

    case 'FETCH_PORTFOLIOS':
      return Object.assign({}, state, {loadingPortfolios: false, portfolios: action.payload})

    default:
      return state;
  }
}
