import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../../src/reducers';
import {WrapperApp} from '../../src/App';
import * as actions from '../../src/reducers/userReducer';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
// });

it('renders without crashing', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
    const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <WrapperApp />
    </Provider>,
    div
  );
});

describe('actions', () => {
  it('should have action updatingUser()', () => {
    const expectedAction = {
      type: actions.userActions.UPDATING
    }
    expect(actions.updatingUser()).toEqual(expectedAction)
  })
});
