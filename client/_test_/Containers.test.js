import React           from 'react';
import ReactDOM        from 'react-dom';
import {Provider}      from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk           from 'redux-thunk';
import ShallowRenderer from 'react-test-renderer/shallow';
import Enzyme          from 'enzyme';
import { shallow, mount, render } from 'enzyme';
import Adapter         from 'enzyme-adapter-react-16';

import rootReducer  from '../src/reducers';
import {WrapperApp} from '../src/App';

import Portfolio  from '../src/classes/Portfolio';
import Position   from '../src/classes/Position';

import ConfirmDialog      from '../src/containers/ConfirmDialog';
import HeadlinesPage      from '../src/containers/HeadlinesPage';
import HelpPage           from '../src/containers/HelpPage';
import PortfolioChartPage from '../src/containers/PortfolioChartPage';
import PortfolioEditPage  from '../src/containers/PortfolioEditPage';
import PortfoliosPage     from '../src/containers/PortfoliosPage';
import PositionsPage      from '../src/containers/PositionsPage';
import PositionEditPage   from '../src/containers/PositionEditPage';
import SettingsEditPage   from '../src/containers/SettingsEditPage';
import SymbolsPage        from '../src/containers/SymbolsPage';

const myDispatch = jest.fn();
const myMock     = jest.fn();
const mySort     = jest.fn();

const myPortfolio  = new Portfolio('1', 'test portfolio');
const myPosition   = new Position(myPortfolio.id, '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);

Enzyme.configure({ adapter: new Adapter() });

function setup() {
const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
const div = document.createElement('div');

  const props = {
    addTodo: jest.fn(),
  };
  const enzymeWrapper = mount(
    <Provider store={store}>
      <PortfolioChartPage portfolio={myPortfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>
    </Provider>,
    div
  );
  return {
    props,
    enzymeWrapper,
  };
}

it('renders HeadlinesPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <HeadlinesPage />
    </Provider>,
    div
  );
});

it('renders PortfoliosPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <PortfoliosPage/>
    </Provider>,
    div
  );
});

it('renders PortfolioChartPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <PortfolioChartPage portfolio={myPortfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>
    </Provider>,
    div
  );
});

it('opens modal when button is clicked', () => {
  // const wrapper = shallow(<ModalContainer />);
  // wrapper.find('button').simulate('click');
  // expect(wrapper.find(ReactModal).prop('isOpen')).toEqual(true);

  const { enzymeWrapper } = setup();
// expect(enzymeWrapper.find('#portfolioChart:first').text()).toBe('todos');
// expect(enzymeWrapper.find({href: '/portfolios/2'}).text()).toBe('todos');

  // const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  // const div = document.createElement('div');
  // const wrapper = ReactDOM.render (
  //   <Provider store={store}>
  //     <PortfolioChartPage portfolio={myPortfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>
  //   </Provider>,
  //   div
  // );

  // wrapper.find('button').simulate('click');

  //
  // const renderer = new ShallowRenderer();
  // renderer.render(<PortfolioChartPage portfolio={myPortfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>);
  // const result = renderer.getRenderOutput();

});

it('renders PositionsPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  const match = {params:{id: '1'}};
  ReactDOM.render (
    <Provider store={store}>
      <PositionsPage match={match}/>
    </Provider>,
    div
  );
});

it('renders PositionEditPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  const match = {params:{id: '1'}};
  ReactDOM.render (
    <Provider store={store}>
      <PositionEditPage position={myPosition} iconName='edit' iconColor='blue' tooltip='Edit position'/>
    </Provider>,
    div
  );
});
