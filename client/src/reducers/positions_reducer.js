export default function positionsReducer(state= {updatingPosition: false, loadingPositions: false, removingPosition: false, positions: {}}, action) {
  switch ( action.type ) {
    case 'LOADING_POSITIONS':
      return Object.assign({}, state, {loadingPositions: true})
    case 'FETCH_POSITIONS':
      return {loadingPositions: false, positions: action.payload}
      case 'REMOVING_POSITION':
        return Object.assign({}, state, {removingPosition: true})
      case 'DELETE_POSITION':
        state.positions.open_positions.splice(action.payload, 1);
        return {removingPosition: false, positions: state.positions}
      case 'UPDATING_POSITION':
        return Object.assign({}, state, {updatingPosition: true})
      case 'UPDATE_POSITION':
// debugger;
        let index = state.positions.open_positions.findIndex(open_position => open_position.stock_symbol.id === action.payload.stock_symbol.id);
        if (index === -1) {
          state.positions.open_positions.unshift(action.payload);
        } else {
          state.positions.open_positions[index] = action.payload;
        }
        return {updatingPosition: false, positions: state.positions}
    default:
      return state;
  }
}
