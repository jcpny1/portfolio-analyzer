import thunk from 'redux-thunk';
import { registerMiddlewares } from 'redux-actions-assertions';
import { buildInitialStoreState, registerInitialStoreState } from 'redux-actions-assertions';
import { registerAssertions } from 'redux-actions-assertions/jest';

import rootReducer from '../../src/reducers';
import Portfolio  from '../../src/classes/Portfolio';
import Position   from '../../src/classes/Position';

// import * as PortfolioReducer from '../../src/reducers/portfolioReducer';

import * as ActionRequest    from '../../src/actions/actionRequests';
import * as PortfolioAction  from '../../src/actions/portfolioActions';
import * as PositionAction   from '../../src/actions/positionActions';
import * as Request          from '../../src/utils/request';

const myMock     = jest.fn();
const mySort     = jest.fn();

const myPortfolio  = new Portfolio('1', 'test portfolio');
const myPosition   = new Position(myPortfolio.id, '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);
const myUser = {locale: 'en-US'};

registerMiddlewares([ thunk ]);
registerInitialStoreState(buildInitialStoreState(rootReducer));

beforeEach(registerAssertions);

describe('Portfolios', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should load a User's Portfolios", done => {
    const expectedActions = [
      // PortfolioReducer.updateAllPortfolio([]),
      // {type: portfolioAction.UPDATE_ALL, payload: portfolios},
      // {"type":"PORTFOLIOS_ERROR","payload":{"prefix":"Load Portfolios: ","error":"only absolute urls are supported"}},
      // {"type":"PORTFOLIO_UPDATING"},{"type":"PORTFOLIOS_ERROR","payload":{"prefix":"Load Portfolios: ","error":"only absolute urls are supported"}}
      {"type":"PORTFOLIO_UPDATING"}
    ];
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }))
    expect(PortfolioAction.portfoliosLoad('false', mySort)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/api/portfolios');
  });
});
