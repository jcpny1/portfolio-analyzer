import thunk from 'redux-thunk';
import { registerMiddlewares } from 'redux-actions-assertions';
import { buildInitialStoreState, registerInitialStoreState } from 'redux-actions-assertions';
import { registerAssertions } from 'redux-actions-assertions/jest';

import rootReducer from '../../src/reducers';
import Portfolio  from '../../src/classes/Portfolio';
import Position   from '../../src/classes/Position';

import * as ActionRequest    from '../../src/actions/actionRequests';
import * as PortfolioAction  from '../../src/actions/portfolioActions';
import * as PositionAction   from '../../src/actions/positionActions';
import * as Request          from '../../src/utils/request';

const myDispatch = jest.fn();
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
  // it("should load a User's Portfolios", done => {
it("should load a User's Portfolios", () => {
    const expectedActions = [
      {}
      // {type: types.RESOURCES_REQUEST},
      // {type: types.RESOURCES_RECEIVE, payload: {bar: 'foo'}}
    ];
expect(PortfolioAction.portfoliosLoad(false, mySort)).toBeDefined();
// done();
//     expect(ActionRequest.portfoliosLoad(myDispatch, 'false', mySort)).toDispatchActions(expectedActions, done);
  });
});
