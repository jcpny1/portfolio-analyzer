import {combineReducers}     from 'redux';
import {portfoliosReducer}   from './portfolios_reducer';
import {stockSymbolsReducer} from './stock_symbols_reducer';

const rootReducer = combineReducers({
  portfolios   : portfoliosReducer,
  stock_symbols: stockSymbolsReducer,
});

export default rootReducer;
