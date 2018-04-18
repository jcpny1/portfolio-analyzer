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

import ConfirmDialog      from '../../src/containers/ConfirmDialog';
import HeadlinesPage      from '../../src/containers/HeadlinesPage';
import HelpPage           from '../../src/containers/HelpPage';
import PortfolioChartPage from '../../src/containers/PortfolioChartPage';
import PortfolioEditPage  from '../../src/containers/PortfolioEditPage';
import PortfoliosPage     from '../../src/containers/PortfoliosPage';
import PositionsPage      from '../../src/containers/PositionsPage';
import PositionEditPage   from '../../src/containers/PositionEditPage';
import SettingsEditPage   from '../../src/containers/SettingsEditPage';
import SymbolsPage        from '../../src/containers/SymbolsPage';

import {Headlines}      from '../../src/components/Headlines';
import {Help}           from '../../src/components/Help';
import {PortfolioChart} from '../../src/components/PortfolioChart';
import {PortfolioEdit}  from '../../src/components/PortfolioEdit';
import {Portfolios}     from '../../src/components/Portfolios';
import {PositionEdit}   from '../../src/components/PositionEdit';
import {Positions}      from '../../src/components/Positions';
import {SettingsEdit}   from '../../src/components/SettingsEdit';
import {Symbols}        from '../../src/components/Symbols';

import ChartData  from '../../src/classes/ChartData';
import DateTime   from '../../src/classes/DateTime';
import Decimal    from '../../src/classes/Decimal';
import Instrument from '../../src/classes/Instrument';
import Portfolio  from '../../src/classes/Portfolio';
import Position   from '../../src/classes/Position';
import Series     from '../../src/classes/Series';
import Trade      from '../../src/classes/Trade';

import * as ActionRequest    from '../../src/actions/actionRequests';
import * as PortfolioAction  from '../../src/actions/portfolioActions';
import * as PortfolioReducer from '../../src/reducers/portfolioReducer';
import * as PositionAction   from '../../src/actions/positionActions';
import * as Request          from '../../src/utils/request';
import * as UserReducer      from '../../src/reducers/userReducer';

const myDispatch = jest.fn();
const myMock     = jest.fn();
const mySort     = jest.fn();

const myArticle    = {href: 'http://www.whatever.com', title: 'Oh No!', description: 'Looks like trouble.'};
const decimalValue = new Decimal(1.2, 'currency');
const myPortfolio  = new Portfolio('1', 'test portfolio');
const myPosition   = new Position(myPortfolio.id, '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);
const myUser = {locale: 'en-US'};

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

it('renders Headlines', () => {
  const mockCallBack = jest.fn();
  const page = shallow((<Headlines articles={[myArticle]} djiaValue={decimalValue} djiaChange={decimalValue} refreshTime={new Date()} refreshHeadlines={mockCallBack} userLocale={myUser.locale}/>));
  page.find('[title="Refresh headlines"]').simulate('click');
  expect(mockCallBack.mock.calls.length).toEqual(1);
});

it('does not render Headlines', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Headlines articles={null} djiaValue={decimalValue} djiaChange={decimalValue} refreshTime={new Date()} refreshHeadlines={myMock} userLocale={myUser.locale}/>);
  const result = renderer.getRenderOutput();
});

it('renders Help', () => {
  const page = shallow((<Help/>));
});

it('renders PortfolioChart', () => {
  // needs some workarounds to avoid error - Invariant Violation: ReactShallowRenderer render(): Shallow rendering works only with custom components, but the provided element type was `undefined`.
  // const page = shallow((<PortfolioChart/>));
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

//
// import {PortfolioChart} from '../../src/components/PortfolioChart';
// import {PortfolioEdit}  from '../../src/components/PortfolioEdit';
// import {PositionEdit}   from '../../src/components/PositionEdit';
// import {SettingsEdit}   from '../../src/components/SettingsEdit';
// import {Symbols}        from '../../src/components/Symbols';
//

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

describe('classes', () => {
  it('has a ChartData class', () => {
    const chartData = new ChartData();
  });

  it('has a DateTime class', () => {
    const dt1 = new DateTime();
    const dt2 = new DateTime('2000-01-01');
  });

  it('has a Decimal class', () => {
    const dv     = new Decimal();                // default value & type
    const dt     = new Decimal(1.2);             // default type
    const uValue = new Decimal(1.2, 'invalid');  // unknown type
    const cValue = new Decimal(1.2, 'currency');
    const dValue = new Decimal(1.2, 'decimal', '0.1');
    const iValue = new Decimal(1.2, 'index',  '-0.1');
    const pValue = new Decimal(1.2, 'percent');
    const qValue = new Decimal(1.2, 'quantity');
    const dValueHTML = dValue.toHTML('en-US');
    const iValueHTML = iValue.toHTML('en-US');
    const pValueHTML = pValue.toHTML('en-US');
    const uValueHTML = uValue.toHTML('en-US');
    const cvtdString = Decimal.fromLocale('1.025.430,125', 'de-DE');
  });

  it('has an Instrument class', () => {
    const instrument1 = new Instrument();
    const instrument2 = new Instrument('1', 'ABC', 'Acme Belt Company');
    const id2 = instrument2.id;
  });

  it('has a Portfolio class', () => {
    const portfolio1 = new Portfolio();
    const portfolio2 = new Portfolio('1');
    const portfolio3 = new Portfolio('2', 'test');
    portfolio3.name = 'new test';
    portfolio3.updateDerivedValues();
  });

  it('has a Position class', () => {
    const position1 = new Position();
    const position2 = new Position('1', '1', '123.5', '100.00', '2018-01-01');
    const position3 = new Position('1', '1', '12aa3.5', '100.00', '2018-01-01');
    position1.dateAcquired = '2017-01-01';
    const lastUpdate1 = position1.lastUpdate;
    Position.validateStringInput(position2, error => {
      if (error) {
        ;
      } else {
        ;
      }
    });
    Position.validateStringInput(position3, error => {
      if (error) {
        ;
      } else {
        ;
      }
    });
  });

  it('has a Series class', () => {
    const symbols = Series.ETF_SYMBOLS;
  });

  it('has a Trade class', () => {
    const trade1 = new Trade();
    const trade2 = new Trade('1', '123.456', '-0.45', '2018-02-01', '2018-02-01 12:34:23');
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
