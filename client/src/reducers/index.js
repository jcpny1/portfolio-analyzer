import {combineReducers}   from 'redux';
import {portfoliosReducer} from './portfolios_reducer';
import {usersReducer}      from './users_reducer';

const rootReducer = combineReducers({
  portfolios: portfoliosReducer,
  users: usersReducer,
});

export default rootReducer;
