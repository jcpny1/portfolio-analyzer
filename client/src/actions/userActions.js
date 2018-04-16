import * as UserReducer from '../reducers/userReducer';
import * as ActionRequest from './actionRequests';

const GUEST_USER_ID = 1;

// Load a user from server.
export function userLoad() {
  return function(dispatch) {
    dispatch(UserReducer.updatingUser());
    ActionRequest.userFetch(dispatch, GUEST_USER_ID);
  }
}

// Update an existing user.
export function userUpdate(user) {
  return function(dispatch) {
    dispatch(UserReducer.updatingUser());
    ActionRequest.userSave(dispatch, user);
  }
}
