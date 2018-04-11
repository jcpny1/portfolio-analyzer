import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import ShallowRenderer from 'react-test-renderer/shallow';
import rootReducer from '../../src/reducers';
import {WrapperApp} from '../../src/App';

import HeadlinesPage from '../../src/containers/HeadlinesPage';
import PortfoliosPage from '../../src/containers/PortfoliosPage';
import PortfolioChartPage from '../../src/containers/PortfolioChartPage';
import PositionsPage from '../../src/containers/PositionsPage';
import PositionEditPage from '../../src/containers/PositionEditPage';

import {Portfolios} from '../../src/components/Portfolios';
import {Positions} from '../../src/components/Positions';

import Decimal from '../../src/classes/Decimal';
import Portfolio from '../../src/classes/Portfolio';
import Position from '../../src/classes/Position';

import * as PositionAction from '../../src/actions/positionActions';
import * as PortfolioReducer from '../../src/reducers/portfolioReducer';
import * as UserReducer from '../../src/reducers/userReducer';

const myMock = jest.fn();
const decimalValue = new Decimal(0.0, 'currency');
const myPortfolio = new Portfolio('1', 'test portfolio');
const myPosition = new Position('1', '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);

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

it('renders Portfolios', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Portfolios portfolios={[myPortfolio]} updatingPortfolio={false} totalCost={decimalValue} totalDayChange={decimalValue} totalGainLoss={decimalValue} totalMarketValue={decimalValue} refreshPortfolios={myMock} onClickRemove={myMock} onClickColHeader={myMock} sortColName={'name'} sortDirection={'ascending'} userLocale={'en-US'}/>);
  const result = renderer.getRenderOutput();
});

it('renders Positions', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Positions portfolio={myPortfolio} updatingPortfolio={false} portfolioRefresh={myMock} onClickSubmit={myMock} onClickRemove={myMock} onClickColHeader={myMock} sortColName={'symbol'} sortDirection={'ascending'} userLocale={'en-US'}/>);
  const result = renderer.getRenderOutput();
});

describe('actions', () => {
  it('should have action User actions', () => {
    expect(UserReducer.errorUser()).toHaveProperty('type');
    expect(UserReducer.updateUser()).toHaveProperty('type');
    expect(UserReducer.updatingUser()).toHaveProperty('type');
    expect(UserReducer.warnUser()).toHaveProperty('type');
  })

  it('should have action updatingPortfolio()', () => {
    expect(PortfolioReducer.addPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.deletePortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.errorPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updatePortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updateAllPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updatingPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.warnPortfolio()).toHaveProperty('type');
  })

  it('should have Position actions', () => {
    expect(PositionAction.positionAdd(myPosition, myMock)).toBeDefined();
    expect(PositionAction.positionDelete('1', '1', myMock)).toBeDefined();
    expect(PositionAction.positionsSort([myPortfolio], 'name', myMock)).toBeDefined();
    expect(PositionAction.positionUpdate(myPosition, myMock)).toBeDefined();
  })
});

// test('root page renders', () => {
//   const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f));
//   const div = document.createElement('div');
//   const component = renderer.create(
//     <Provider store={store}>
//       <WrapperApp />
//     </Provider>,
//     div
//   );
// });

  // let tree = component.toJSON();
  // expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseEnter();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
  //
  // // manually trigger the callback
  // tree.props.onMouseLeave();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
