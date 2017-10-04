import { combineReducers } from 'redux';
import portfoliosReducer from './portfolios_reducer';
import positionsReducer  from './positions_reducer';
import pricesReducer     from './prices_reducer';

const rootReducer = combineReducers({
  portfolios: portfoliosReducer,
  positions:  positionsReducer,
  prices:     pricesReducer,
});

export default rootReducer;
