import Portfolio  from '../src/classes/Portfolio';
import Position   from '../src/classes/Position';

import * as ActionRequest    from '../src/actions/fetchActions';
import * as PortfolioAction  from '../src/actions/portfolioActions';
import * as PositionAction   from '../src/actions/positionActions';
import * as Request          from '../src/utils/request';

const myDispatch = jest.fn();
const myMock     = jest.fn();
const mySort     = jest.fn();

const myPortfolio  = new Portfolio('1', 'test portfolio');
const myPosition   = new Position(myPortfolio.id, '1', 100.0, 1.0, '2018-01-01');
myPortfolio._positions.push(myPosition);
const myUser = {locale: 'en-US'};

describe('Portfolio action creators', () => {
  it('should have actions', () => {
    expect(PortfolioAction.portfolioAdd(myPortfolio)).toBeDefined();
    expect(PortfolioAction.portfolioDelete(myPortfolio.id)).toBeDefined();
    expect(PortfolioAction.portfoliosLoad(false, mySort)).toBeDefined();
    expect(PortfolioAction.portfoliosSort([myPortfolio], 'name', mySort)).toBeDefined();
    expect(PortfolioAction.portfolioUpdate(myPortfolio)).toBeDefined();
  });
});

describe('action creators', () => {
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
    expect(ActionRequest.userFetch(myDispatch, myUser.id)).resolves.toBeUndefined();
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
