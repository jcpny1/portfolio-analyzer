import React           from 'react';
import ReactDOM        from 'react-dom';
import {Provider}      from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk           from 'redux-thunk';
import ShallowRenderer from 'react-test-renderer/shallow';

import rootReducer  from '../../src/reducers';
import {WrapperApp} from '../../src/App';

import HeadlinesPage      from '../../src/containers/HeadlinesPage';
import PortfoliosPage     from '../../src/containers/PortfoliosPage';
import PortfolioChartPage from '../../src/containers/PortfolioChartPage';
import PositionsPage      from '../../src/containers/PositionsPage';
import PositionEditPage   from '../../src/containers/PositionEditPage';

import {Portfolios} from '../../src/components/Portfolios';
import {Positions}  from '../../src/components/Positions';

import Decimal   from '../../src/classes/Decimal';
import Portfolio from '../../src/classes/Portfolio';
import Position  from '../../src/classes/Position';

import * as ActionRequest    from '../../src/actions/actionRequests';
import * as PortfolioAction  from '../../src/actions/portfolioActions';
import * as PortfolioReducer from '../../src/reducers/portfolioReducer';
import * as PositionAction   from '../../src/actions/positionActions';
import * as Request          from '../../src/utils/request';
import * as UserReducer      from '../../src/reducers/userReducer';

const myDispatch = jest.fn();
const myMock     = jest.fn();
const mySort     = jest.fn();

const decimalValue = new Decimal(1.2, 'currency');
const myPortfolio  = new Portfolio('1', 'test portfolio');
const myPosition   = new Position(myPortfolio.id, '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);
const myUser = {locale: 'en-US'};

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
  renderer.render(<Portfolios portfolios={[myPortfolio]} updatingPortfolio={false} totalCost={decimalValue} totalDayChange={decimalValue} totalGainLoss={decimalValue} totalMarketValue={decimalValue} refreshPortfolios={myMock} onClickRemove={myMock} onClickColHeader={myMock} sortColName={'name'} sortDirection={'ascending'} userLocale={myUser.locale}/>);
  const result = renderer.getRenderOutput();
});

it('renders Positions', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Positions portfolio={myPortfolio} updatingPortfolio={false} portfolioRefresh={myMock} onClickSubmit={myMock} onClickRemove={myMock} onClickColHeader={myMock} sortColName={'symbol'} sortDirection={'ascending'} userLocale={myUser.locale}/>);
  const result = renderer.getRenderOutput();
});

describe('actions', () => {
  it('should have User actions', () => {
    expect(UserReducer.errorUser()).toHaveProperty('type');
    expect(UserReducer.updateUser()).toHaveProperty('type');
    expect(UserReducer.updatingUser()).toHaveProperty('type');
    expect(UserReducer.warnUser()).toHaveProperty('type');
  });

  it('should have Portfolio actions', () => {
    expect(PortfolioAction.portfolioAdd(myPortfolio)).toBeDefined();
    expect(PortfolioAction.portfolioDelete(myPortfolio.id)).toBeDefined();
    expect(PortfolioAction.portfoliosLoad(false, mySort)).toBeDefined();
    expect(PortfolioAction.portfoliosSort([myPortfolio], 'name', mySort)).toBeDefined();
    expect(PortfolioAction.portfolioUpdate(myPortfolio)).toBeDefined();
  });

  it('should have Portfolio reducers', () => {
    expect(PortfolioReducer.addPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.deletePortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.errorPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updatePortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updateAllPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updatingPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.warnPortfolio()).toHaveProperty('type');
  });

  it('should have Position actions', () => {
    expect(PositionAction.positionAdd(myPosition, mySort)).toBeDefined();
    expect(PositionAction.positionDelete(myPortfolio.id, myPosition.id, mySort)).toBeDefined();
    expect(PositionAction.positionsSort([myPortfolio], 'name', mySort)).toBeDefined();
    expect(PositionAction.positionUpdate(myPosition, mySort)).toBeDefined();
  });

  it('should have ActionRequests', () => {
    expect(ActionRequest.portfolioAdd(myDispatch, myPortfolio)).toBeUndefined();
    expect(ActionRequest.portfolioDelete(myDispatch, myPortfolio.id)).toBeUndefined();
    expect(ActionRequest.portfolioUpdate(myDispatch, myPortfolio)).toBeUndefined();
    expect(ActionRequest.portfoliosLoad(myDispatch, 'false', mySort)).toBeUndefined();
    expect(ActionRequest.positionAdd(myDispatch, myPosition, mySort)).toBeUndefined();
    expect(ActionRequest.positionDelete(myDispatch, myPortfolio.id, myPosition.id, mySort)).toBeUndefined();
    expect(ActionRequest.positionUpdate(myDispatch, myPosition, mySort)).toBeUndefined();
    expect(ActionRequest.userFetch(myDispatch, myUser.id)).resolves.toBe({});
    expect(ActionRequest.userSave(myDispatch, myUser)).toBeUndefined();
  });

  it('should have Requests', () => {
    expect(Request.headlinesRefresh(myMock)).toBeUndefined();
    expect(Request.indexesRefresh(myMock)).toBeUndefined();
    expect(Request.instrumentSearch({}, myMock)).toBeTruthy();
    expect(Request.instrumentsRefresh()).toBeUndefined();
    expect(Request.pricesRefresh()).toBeUndefined();
    expect(Request.seriesFetch()).toBeUndefined();
    expect(Request.seriesRefresh('active')).toBeUndefined();
    expect(Request.seriesRefreshActive()).toBeUndefined();
    expect(Request.seriesRefreshAll()).toBeUndefined();
    expect(Request.statusCheck('')).toEqual("");
  });
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
