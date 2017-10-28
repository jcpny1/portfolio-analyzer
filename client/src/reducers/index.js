import {combineReducers}     from 'redux';
import {portfoliosReducer}   from './portfolios_reducer';

const rootReducer = combineReducers({
  portfolios: portfoliosReducer,
});

export default rootReducer;
