import React           from 'react';
import ReactDOM        from 'react-dom';
import {Provider}      from 'react-redux';
import {createStore, applyMiddleware, compose } from 'redux';
import thunk           from 'redux-thunk';
import ShallowRenderer from 'react-test-renderer/shallow';
import Enzyme          from 'enzyme';
import { shallow, mount, render } from 'enzyme';
import Adapter         from 'enzyme-adapter-react-16';

import rootReducer  from '../src/reducers';
import {WrapperApp} from '../src/App';

import {Headlines}      from '../src/components/Headlines';
import {Help}           from '../src/components/Help';
import {PortfolioChart} from '../src/components/PortfolioChart';
import {PortfolioEdit}  from '../src/components/PortfolioEdit';
import {Portfolios}     from '../src/components/Portfolios';
import {PositionEdit}   from '../src/components/PositionEdit';
import {Positions}      from '../src/components/Positions';
import {SettingsEdit}   from '../src/components/SettingsEdit';
import {Symbols}        from '../src/components/Symbols';

import Decimal    from '../src/classes/Decimal';
import Portfolio  from '../src/classes/Portfolio';
import Position   from '../src/classes/Position';

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
