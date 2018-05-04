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

describe('Positions', () => {
  beforeEach(() => {
    registerAssertions();
    fetch.resetMocks();
  });

  it("adds a new Position", done => {
    const portfolio = new Portfolio('999', 'jestMock');
    const position = new Position(portfolio.id, '', '100', '34.56', '04/05/2016');
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PositionAction.positionAdd(position, mySort)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/api/portfolios/${position.portfolio_id}/positions`);
    done();
  });

  it("deletes a Position", done => {
    const portfolio = new Portfolio('999', 'jestMock');
    const position = new Position(portfolio.id, '999111', '100', '34.56', '04/05/2016');
    portfolio.positions.push(position);
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PositionAction.positionDelete(position.portfolio_id, position.id, mySort)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/api/portfolios/${position.portfolio_id}/positions/${position.id}`);
    done();
  });

  it("sorts Positions", done => {
    const portfolios = [new Portfolio('999', 'jestMock')];
    const position = new Position(portfolios[0].id, '999111', '100', '34.56', '04/05/2016');
    portfolios[0].positions.push(position);
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    expect(PositionAction.positionsSort(portfolios, 'symbol', mySort)).toDispatchActions(expectedActions, done);
    expect(mySort.mock.calls.length).toEqual(1);
    done();
  });

  it("updates a Position", done => {
    const portfolios = [new Portfolio('999', 'jestMock')];
    const position = new Position(portfolios[0].id, '999111', '120', '34.56', '04/05/2016');
    portfolios[0].positions.push(position);
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({data: {id:'12345', attributes:{name:'xyz'}}, included:{}}));
    expect(PositionAction.positionUpdate(position)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`/api/portfolios/${position.portfolio_id}/positions/${position.id}`);
    done();
  });
});
