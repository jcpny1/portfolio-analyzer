import ChartData  from '../src/classes/ChartData';
import DateTime   from '../src/classes/DateTime';
import Decimal    from '../src/classes/Decimal';
import Instrument from '../src/classes/Instrument';
import Portfolio  from '../src/classes/Portfolio';
import Position   from '../src/classes/Position';
import Series     from '../src/classes/Series';
import Trade      from '../src/classes/Trade';

describe('classes', () => {
  it('has a ChartData class', () => {
    const chartData = new ChartData();
  });

  it('has a ChartData class', () => {
    const chartData    = new ChartData();
    const myPortfolio  = new Portfolio('1', 'test portfolio');
    const portfolioSymbolIds = [];
    const series = {
      data: [{attributes: {'series-date': '2018-01-01'}, relationships: {instrument: {data: {id: '1'}}}}],
      included: [{id:'1', attributes:{symbol:'AAPL', name:'Apple'}}]
    };
    ChartData.seriesDataToChartData(series, myPortfolio.name, portfolioSymbolIds);
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
