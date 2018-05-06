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

function setup() {
  const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
  const props = { addTodo: jest.fn() };
  const enzymeWrapper = shallow(<PortfolioChartPage store={store} portfolio={myPortfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>);
  return { props, enzymeWrapper };
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

  enzymeWrapper.setState({ modalOpen: true });

  console.log('wrapper.debug(): ' + JSON.stringify(enzymeWrapper.debug()));
  console.log('wrapper.dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().debug()));
  console.log('wrapper.dive().dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().dive().debug()));
  console.log('wrapper.dive().dive().dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().dive().dive().debug()));
  console.log('wrapper.dive().dive().dive().dive().debug(): ' + JSON.stringify(enzymeWrapper.dive().dive().dive().dive().debug()));
  console.log('wrapper.props(): ' + JSON.stringify(enzymeWrapper.props()));
  console.log('wrapper.props().iconName: ' + JSON.stringify(enzymeWrapper.props().iconName));
  console.log('wrapper.children(): ' + JSON.stringify(enzymeWrapper.children()));
  console.log('wrapper.childAt(0): ' + JSON.stringify(enzymeWrapper.childAt(0)));
  console.log('wrapper.props().children: ' + JSON.stringify(enzymeWrapper.props().children));

  console.log('enzymeWrapper.find(PortfolioChartPage).debug(): ' + JSON.stringify(enzymeWrapper.find('PortfolioChartPage').debug()));
  console.log('enzymeWrapper.find(PortfolioChartPage).dive().debug(): ' + JSON.stringify(enzymeWrapper.find('PortfolioChartPage').dive().debug()));
  console.log('enzymeWrapper.find(PortfolioChartPage).dive().find(Button).debug(): ' + JSON.stringify(enzymeWrapper.find('PortfolioChartPage').dive().find('Button').debug()));

  const myButton = enzymeWrapper.find('PortfolioChartPage').dive().find('Button');

  expect(enzymeWrapper.props().iconName).toEqual('chart line');
  enzymeWrapper.find('PortfolioChartPage').dive().instance().handleOpen();

  console.log(myButton.debug());
  myButton.simulate('click');

  // enzymeWrapper.dive().instance().handleOpen();

  // expect(enzymeWrapper.find(Modal).dive().find(Modal)).to.have.length(1);

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
