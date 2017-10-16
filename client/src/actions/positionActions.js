import fetch from 'isomorphic-fetch';
import Fetch from '../utils/Fetch';
import {portfolioActions} from '../reducers/portfolios_reducer';

function addPositionAction(payload) {return {type: portfolioActions.ADD_POSITION, payload: payload};}
function deletePositionAction(payload) {return {type: portfolioActions.DELETE_POSITION, payload: payload};}
function errorPositionAction(payload) {return {type: portfolioActions.ERROR_POSITIONS, payload: payload};}
function loadPositionsAction(payload) {return {type: portfolioActions.LOAD_POSITIONS, payload: payload};}
function updatePositionAction(payload) {return {type: portfolioActions.UPDATE_POSITIONS, payload: payload};}
function updatingPositionAction() {return {type: portfolioActions.UPDATING_POSITION};}

export function addPosition(open_position) {
  return function(dispatch) {
    dispatch(updatingPositionAction());
    return (
      fetch(`/api/portfolios/${open_position.portfolio_id}/open_positions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_id: open_position.stock_symbol_id,
          quantity: open_position.quantity,
          cost: open_position.cost,
          date_acquired: open_position.date_acquired,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.id) {
          dispatch(addPositionAction(responseJson));
        } else {
          throw responseJson;
        }
      })
      .catch(error => dispatch(errorPositionAction({prefix: 'Add Position Error: ', error: error})))
    );
  }
}

export function deletePosition(open_position) {
  return function(dispatch) {
    dispatch(updatingPositionAction());
    return (
      fetch(`/api/portfolios/${open_position.portfolio_id}/open_positions/${open_position.id}`, {
        method: 'DELETE',
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.id) {
          dispatch(deletePositionAction(open_position));
        } else {
          throw responseJson;
        }
      })
      .catch(error => dispatch(errorPositionAction({prefix: 'Delete Position Error: ', error: error})))
    );
  }
}

export function loadPositions(portfolio_id) {
  return function(dispatch) {
    dispatch(updatingPositionAction());
    return (
      fetch(`/api/portfolios/${portfolio_id}`)
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length) {
          dispatch(loadPositionsAction(responseJson));
        } else {
          throw responseJson;
        }
      })
      .catch(error => dispatch(errorPositionAction({prefix: 'Load Positions Error: ', error: error})))
    );
  }
}

export function updatePosition(open_position) {
  return function(dispatch) {
    dispatch(updatingPositionAction());
    return (
      fetch(`/api/portfolios/${open_position.portfolio_id}/open_positions/${open_position.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol_id: open_position.stock_symbol_id,
          quantity: open_position.quantity,
          cost: open_position.cost,
          date_acquired: open_position.date_acquired,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.id) {
          dispatch(updatePositionAction(responseJson));
        } else {
          throw responseJson;
        }
      })
      .catch(error => dispatch(errorPositionAction({prefix: 'Update Position Error: ', error: error})))
    );
  }
}
