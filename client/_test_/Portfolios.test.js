import thunk from 'redux-thunk';
import { registerMiddlewares } from 'redux-actions-assertions';
import { buildInitialStoreState, registerInitialStoreState } from 'redux-actions-assertions';
import { registerAssertions } from 'redux-actions-assertions/jest';

import rootReducer from '../src/reducers';
import Portfolio   from '../src/classes/Portfolio';
import Position    from '../src/classes/Position';

// import * as PortfolioReducer from '../../src/reducers/portfolioReducer';

import * as PortfolioAction  from '../src/actions/portfolioActions';
import * as PositionAction   from '../src/actions/positionActions';
import * as Request          from '../src/utils/request';

const myMock = jest.fn();
const mySort = jest.fn();

const myPortfolio  = new Portfolio('1', 'test portfolio');
const myPosition   = new Position(myPortfolio.id, '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);
const myUser = {locale: 'en-US'};

registerMiddlewares([ thunk ]);
registerInitialStoreState(buildInitialStoreState(rootReducer));

describe('Portfolios', () => {
  beforeEach(() => {
    registerAssertions();
    fetch.resetMocks();
  });

  it("adds a new Portfolio", done => {
    const portfolio = new Portfolio('', 'jestMock');
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PortfolioAction.portfolioAdd(portfolio)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/api/portfolios/');
    done();
  });

  it("deletes a Portfolio", done => {
    const portfolio = new Portfolio('999', 'jestMock');
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PortfolioAction.portfolioDelete(portfolio.id)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/api/portfolios/${portfolio.id}`);
    done();
  });

  it("should load a User's Portfolios", done => {
    const expectedActions = [
      // PortfolioReducer.updateAllPortfolio([]),
      // {type: portfolioAction.UPDATE_ALL, payload: portfolios},
      // {"type":"PORTFOLIOS_ERROR","payload":{"prefix":"Load Portfolios: ","error":"only absolute urls are supported"}},
      // {"type":"PORTFOLIO_UPDATING"},{"type":"PORTFOLIOS_ERROR","payload":{"prefix":"Load Portfolios: ","error":"only absolute urls are supported"}}
      {"type":"PORTFOLIO_UPDATING"}
    ];

    // fetch.mockResponses(
    //   [
    //     JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}),
    //     { status: 200 }
    //   ],
    //   [
    //     JSON.stringify([{ name: 'bleach', average_score: 68 }]),
    //     { status: 200 }
    //   ],
    //   [
    //     JSON.stringify([{ name: 'one piece', average_score: 80 }]),
    //     { status: 200 }
    //   ],
    //   [
    //     JSON.stringify([{ name: 'shingeki', average_score: 91 }]),
    //     { status: 200 }
    //   ]
    // );

    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PortfolioAction.portfoliosLoad('false', mySort)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/api/portfolios/');
    done();
  });

  it("sorts Portfolios", done => {
    const portfolios = [new Portfolio('999', 'jestMock')];
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    expect(PortfolioAction.portfoliosSort(portfolios, 'name', mySort)).toDispatchActions(expectedActions, done);
    expect(mySort.mock.calls.length).toEqual(1);
    done();
  });

  it("updates a Portfolio", done => {
    const portfolio = new Portfolio('999', 'jestMock');
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PortfolioAction.portfolioUpdate(portfolio)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/api/portfolios/${portfolio.id}`);
    done();
  });
});
