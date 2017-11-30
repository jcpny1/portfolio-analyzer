import Fmt from '../utils/formatter';

export const userActions = {
  ERROR_USERS  : 'ERROR_USERS',
  UPDATE_USER  : 'UPDATE_USER',
  UPDATING_USER: 'UPDATING_USER',
  WARN_USERS   : 'WARN_USERS',
};

export function errorUserAction(error)  {return {type: userActions.ERROR_USERS,     payload: error}}
export function updateUserAction(user)  {return {type: userActions.UPDATE_USER,     payload: user}}
export function updatingUserAction()    {return {type: userActions.UPDATING_USER}}
export function warnUserAction(warning) {return {type: userActions.WARN_PORTFOLIOS, payload: warning}}

export function usersReducer(state = {updatingUser: false, user: {locale: 'en-US'}}, action) {
  let returnObject = {};
  switch (action.type) {
    // Error on Portfolio action.
    case userActions.ERROR_USERS: {
      const {prefix, error} = action.payload;
      alert(Fmt.serverError(prefix, error));
      returnObject = Object.assign({}, state, {updatingUser: false});
      break;
    }

    // Update one User.
    case userActions.UPDATE_USER: {
      const payloadUser = action.payload;
      returnObject = Object.assign({}, state, {updatingUser: false, user: payloadUser});
      break;
    }

    // Show that User is being modified.
    case userActions.UPDATING_USER:
      returnObject = Object.assign({}, state, {updatingUser: true});
      break;

    // Warning on User action.
    case userActions.WARN_USERS: {
      const {prefix, warning} = action.payload;
      alert(Fmt.serverError(prefix, warning));
      returnObject = state;
      break;
    }

    // Default action.
    default:
      returnObject = state;
      break;
  }
  return returnObject;
}
