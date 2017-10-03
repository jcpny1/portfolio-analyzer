export default function usersReducer(state= {loading: false, portfolios: []}, action) {
  switch ( action.type ) {
    case 'LOADING_PORTFOLIOS':
      return Object.assign({}, state, {loading: true})
    case 'FETCH_PORTFOLIOS':
      return {loading: false, portfolios: action.payload}
    default:
      return state;
  }
}
