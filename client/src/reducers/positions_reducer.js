export default function positionsReducer(state= { loadingPositions: false, removingPosition: false, positions: {} }, action) {
  switch ( action.type ) {
    case 'LOADING_POSITIONS':
      return Object.assign({}, state, { loadingPositions: true })
    case 'FETCH_POSITIONS':
      return { loadingPositions: false, positions: action.payload }
    case 'REMOVING_POSITION':
      return Object.assign({}, state, { removingPosition: true })
    case 'DELETE_POSITION':
      state.positions.open_positions.splice(action.payload, 1);
      return { removingPosition: false, positions: state.positions }
    default:
      return state;
  }
}
