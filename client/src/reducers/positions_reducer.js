export default function positionsReducer(state= { loadingPositions: false, positions: {} }, action) {
  switch ( action.type ) {
    case 'LOADING_POSITIONS':
      return Object.assign({}, state, {loadingPositions: true})
    case 'FETCH_POSITIONS':
      return {loadingPositions: false, positions: action.payload}
    default:
      return state;
  }
}
