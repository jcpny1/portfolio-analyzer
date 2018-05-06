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

    fetch.mockResponses(
      [ JSON.stringify(
        { data:
          [
            { id:myPortfolio.id, attributes:{ name:myPortfolio.name }, relationships:{ positions: {data: [{type:'positions', id:'1'}, {type:'unknown'}] } } },
          ],
          included:
          [
            { type:'instruments', id:'1', attributes:{ symbol:'AAPL', name:'Apple' } },
            { type:'positions',   id:'1',
                attributes:{ 'portfolio-id':myPortfolio.id, quantity:1, cost:1.00, 'date-acquired':'04/01/2018'},
                relationships:{ instrument:{ data:{ id:'1' } } },
            },
            { type:'unknown' },
          ],
        }
      )],
      [ JSON.stringify(
        { data:
          [
            { attributes:{ 'instrument-id':'1', 'trade-price':123.321, 'price-change':-1.5, 'trade-date':'05/01/2018', 'created-at':'05/01/2018 13:43:15' } },
          ],
          included:
          [
            { type:'instruments', id:'1', attributes:{ symbol:'AAPL', name:'Apple' } },
            { type:'positions',   id:'1',
                attributes:{ 'portfolio-id':myPortfolio.id, quantity:1, cost:1.00, 'date-acquired':'04/01/2018'},
                relationships:{ instrument:{ data:{ id:1 } } },
            },
            { type:'unknown' },
          ],
        }
      )],
    );
    expect(PortfolioAction.portfoliosLoad(true, mySort)).toDispatchActions(expectedActions, done);
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/api/portfolios/');
// TODO: WHY NO SORT?
    expect(mySort.mock.calls.length).toEqual(0);
    done();
  });

  //   case 'positions':
  //     positions.push(new Position(relation.attributes['portfolio-id'], relation.id, relation.attributes.quantity, relation.attributes.cost, relation.attributes['date-acquired']));
  //     break;

  it("sorts Portfolios", done => {
    const portfolios = [new Portfolio('999', 'jestMock')];
    const expectedActions = [
      {"type":"PORTFOLIO_UPDATING"}
    ];
    expect(PortfolioAction.portfoliosSort(portfolios, 'name', mySort)).toDispatchActions(expectedActions, done);
// TODO: WHY 2 and NOT 1? Shouldn't beforeEach reset the count? or are we calling it twice here?
    expect(mySort.mock.calls.length).toEqual(2);
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
