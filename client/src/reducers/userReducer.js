import Fmt from '../utils/formatter';

export const userActions = {
  ERROR   : 'USER_ERROR',
  UPDATE  : 'USER_UPDATE',
  UPDATING: 'USER_UPDATING',
  WARN    : 'USER_WARN',
};

export function errorUser(error)  {return {type: userActions.ERROR,  payload: error}}
export function updateUser(user)  {return {type: userActions.UPDATE, payload: user}}
export function updatingUser()    {return {type: userActions.UPDATING}}
export function warnUser(warning) {return {type: userActions.WARN,   payload: warning}}

export function userReducer(state = {updatingUser: false, user: {locale: 'en-US'}}, action) {
  let returnObject = null;
  switch (action.type) {
    // Error on Portfolio action.
    case userActions.ERROR: {
      const {prefix, error} = action.payload;
      alert(Fmt.serverError(prefix, error));
      returnObject = Object.assign({}, state, {updatingUser: false});
      break;
    }
    // Update one User.
    case userActions.UPDATE: {
      const payloadUser = action.payload;
      returnObject = Object.assign({}, state, {updatingUser: false, user: payloadUser.data.attributes});
      break;
    }
    // Show that User is being modified.
    case userActions.UPDATING:
      returnObject = Object.assign({}, state, {updatingUser: true});
      break;
    // Warning on User action.
    case userActions.WARN: {
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
