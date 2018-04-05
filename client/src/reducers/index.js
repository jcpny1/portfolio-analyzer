import {combineReducers}   from 'redux';
import {portfolioReducer} from './portfolioReducer';
import {userReducer}      from './userReducer';

const rootReducer = combineReducers({
  portfolios: portfolioReducer,
  users: userReducer,
});

export default rootReducer;
