import Fmt from '../utils/formatter';

const userAction = {
  ERROR   : 'USER_ERROR',
  UPDATE  : 'USER_UPDATE',
  UPDATING: 'USER_UPDATING',
  WARN    : 'USER_WARN',
};

export function errorUser(error)  {return {type: userAction.ERROR,  payload: error}}
export function updateUser(user)  {return {type: userAction.UPDATE, payload: user}}
export function updatingUser()    {return {type: userAction.UPDATING}}
export function warnUser(warning) {return {type: userAction.WARN,   payload: warning}}

export function userReducer(state = {updatingUser: false, user: {locale: 'en-US'}}, action) {
  let returnObject = null;
  switch (action.type) {
    // Error on Portfolio action.
    case userAction.ERROR: {
      const {prefix, error} = action.payload;
      alert(Fmt.serverError(prefix, error));
      returnObject = Object.assign({}, state, {updatingUser: false});
      break;
    }
    // Update one User.
    case userAction.UPDATE: {
      const payloadUser = action.payload;
      returnObject = Object.assign({}, state, {updatingUser: false, user: payloadUser.data.attributes});
      break;
    }
    // Show that User is being modified.
    case userAction.UPDATING:
      returnObject = Object.assign({}, state, {updatingUser: true});
      break;
    // Warning on User action.
    case userAction.WARN: {
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
