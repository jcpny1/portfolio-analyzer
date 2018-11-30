import React           from 'react';
import ReactDOM        from 'react-dom';
import {Provider}      from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk           from 'redux-thunk';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
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

it('renders HeadlinesPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  fetch.mockResponses(
    [ JSON.stringify(
      { articles:
        [
          { title:'What I did last summer', url:'http://www.www.com', description:'last summer activities' },
        ],
      }
    )],
    [ JSON.stringify(
      { data:
        [
          { attributes:{ instrument:{ symbol:'DJIA' }, 'trade-price':'24567.213', 'price-change':'123.456' } },
        ],
      }
    )],
  );
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

it('renders PortfolioEditPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <PortfolioEditPage portfolio={myPortfolio} iconName='edit' iconColor='blue' tooltip='Edit portfolio name'/>
    </Provider>,
    div
  );
});

function setupPortfolioEditPage() {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const props = { addTodo: jest.fn() };
  const enzymeWrapper = shallow(<PortfolioEditPage store={store} portfolio={myPortfolio} iconName='edit' iconColor='blue' tooltip='Edit portfolio name'/>);
  return { props, enzymeWrapper };
}

it('renders a portfolio editor', () => {
  const { enzymeWrapper } = setupPortfolioEditPage();
  expect(enzymeWrapper.props().iconName).toEqual('edit');
  enzymeWrapper.find('PortfolioEditPage').dive().instance().handleOpen();
  const myButton = enzymeWrapper.find('PortfolioEditPage').dive().find("Button[color='red']");
  myButton.simulate('click');
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

function setupPortfolioChartPage() {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const props = { addTodo: jest.fn() };
  const enzymeWrapper = shallow(<PortfolioChartPage store={store} portfolio={myPortfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>);
  return { props, enzymeWrapper };
}

it('renders a portfolio chart', () => {
  const { enzymeWrapper } = setupPortfolioChartPage();
  expect(enzymeWrapper.props().iconName).toEqual('chart line');
  enzymeWrapper.find('PortfolioChartPage').dive().instance().handleOpen();
  const myButton = enzymeWrapper.find('PortfolioChartPage').dive().find('Button');
  myButton.simulate('click');
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
  ReactDOM.render (
    <Provider store={store}>
      <PositionEditPage position={myPosition} iconName='edit' iconColor='blue' tooltip='Edit position'/>
    </Provider>,
    div
  );
});

function setupPositionEditPage() {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const props = { addTodo: jest.fn() };
  const enzymeWrapper = shallow(<PositionEditPage store={store} position={myPosition} iconName='edit' iconColor='blue' tooltip='Edit position'/>);
  return { props, enzymeWrapper };
}

it('renders a position editor', () => {
  const { enzymeWrapper } = setupPositionEditPage();
  expect(enzymeWrapper.props().iconName).toEqual('edit');
  enzymeWrapper.find('PositionEditPage').dive().instance().handleOpen();
  const myButton = enzymeWrapper.find('PositionEditPage').dive().find("Button[color='red']");
  myButton.simulate('click');
});

it('renders SymbolsPage', () => {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const div = document.createElement('div');
  ReactDOM.render (
    <Provider store={store}>
      <SymbolsPage/>
    </Provider>,
    div
  );
});

function setupSymbolsPage() {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const props = { addTodo: jest.fn() };
  const enzymeWrapper = shallow(<SymbolsPage store={store}/>);
  return { props, enzymeWrapper };
}

it('renders a symbols searcher', () => {
  const sp = new SymbolsPage;
  sp.handleOpen();
  const { enzymeWrapper } = setupSymbolsPage();
  const myButton = enzymeWrapper.find('Button');
  myButton.simulate('click');
  // console.log('SymbolsPage wrapper.debug(): ' + JSON.stringify(enzymeWrapper.debug()));
  // console.log('wrapper.dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().debug()));
  // console.log('wrapper.dive().dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().dive().debug()));
  // console.log('wrapper.dive().dive().dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().dive().dive().debug()));
  // console.log('wrapper.dive().dive().dive().dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().dive().dive().dive().debug()));
  // console.log('wrapper.props(): ' + JSON.stringify(enzymeWrapper.props()));
  // console.log('wrapper.props().iconName: ' + JSON.stringify(enzymeWrapper.props().iconName));
  // console.log('wrapper.children(): ' + JSON.stringify(enzymeWrapper.children()));
  // console.log('wrapper.childAt(0): ' + JSON.stringify(enzymeWrapper.childAt(0)));
  // console.log('wrapper.props().children: ' + JSON.stringify(enzymeWrapper.props().children));
  // console.log('enzymeWrapper.find(PortfolioChartPage).debug(): ' + JSON.stringify(enzymeWrapper.find('PortfolioChartPage').debug()));
  // console.log('enzymeWrapper.find(PortfolioChartPage).dive().debug(): ' + JSON.stringify(enzymeWrapper.find('PortfolioChartPage').dive().debug()));
  // console.log('enzymeWrapper.find(PortfolioChartPage).dive().find(Button).debug(): ' + JSON.stringify(enzymeWrapper.find('PortfolioChartPage').dive().find('Button').debug()));
  //
});
