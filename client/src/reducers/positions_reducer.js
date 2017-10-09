export default function positionsReducer(state= {updatingPosition: false, loadingPositions: false, removingPosition: false, portfolio_id: -1, positions: {}}, action) {
// console.log("ACTION type: " + action.type + " pl: " + action.payload + " STATE: " + JSON.stringify(state));
  switch ( action.type ) {
    // Load Positions
    case 'LOADING_POSITIONS':
      return Object.assign({}, state, {loadingPositions: true, portfolio_id: action.payload})
    case 'LOAD_POSITIONS':
      return Object.assign({}, state, {loadingPositions: false, positions: action.payload})
    // Delete a Position
    case 'DELETING_POSITION':
      return Object.assign({}, state, {removingPosition: true})
    case 'DELETE_POSITION':
      state.positions.open_positions.splice(action.payload, 1);
      return Object.assign({}, state, {removingPosition: false, positions: state.positions})
    // Add or Update a Position
    case 'UPDATING_POSITION':
      return Object.assign({}, state, {updatingPosition: true})
    case 'UPDATE_POSITION':
      let index = state.positions.open_positions.findIndex(open_position => open_position.stock_symbol.id === action.payload.stock_symbol.id);
      if (index === -1) {
        state.positions.open_positions.unshift(action.payload);
      } else {
        state.positions.open_positions[index] = action.payload;
      }
      return Object.assign({}, state, {updatingPosition: false, positions: state.positions})
    // default action
    default:
      return state;
  }
}
