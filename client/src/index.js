import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import {WrapperApp} from './App'
import registerServiceWorker from './registerServiceWorker';
import './semantic-ui/semantic.min.css';
import './index.css'

const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));

ReactDOM.render (
  <Provider store={store}>
    <WrapperApp />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
