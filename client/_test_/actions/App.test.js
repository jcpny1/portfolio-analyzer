import React           from 'react';
import ReactDOM        from 'react-dom';
import {Provider}      from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk           from 'redux-thunk';
import ShallowRenderer from 'react-test-renderer/shallow';
import Enzyme          from 'enzyme';
import { shallow, mount, render } from 'enzyme';
import Adapter         from 'enzyme-adapter-react-16';

import rootReducer  from '../../src/reducers';
import {WrapperApp} from '../../src/App';

Enzyme.configure({ adapter: new Adapter() });

it('renders Home page', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <WrapperApp />
    </Provider>,
    div
  );
});
