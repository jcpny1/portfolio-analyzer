import { combineReducers } from 'redux';
import portfoliosReducer from './portfolios_reducer';
import positionsReducer  from './positions_reducer';

const rootReducer = combineReducers({
  portfolios: portfoliosReducer,
  positions:  positionsReducer
});

export default rootReducer;
