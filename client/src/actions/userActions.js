import * as UserReducer from '../reducers/userReducer';
import * as FetchAction from './fetchActions';

const GUEST_USER_ID = 1;

// Load a user from server.
export function userLoad() {
  return function(dispatch) {
    dispatch(UserReducer.updatingUser());
    FetchAction.userFetch(dispatch, GUEST_USER_ID);
  }
}

// Update an existing user.
export function userUpdate(user) {
  return function(dispatch) {
    dispatch(UserReducer.updatingUser());
    FetchAction.userSave(dispatch, user);
  }
}
