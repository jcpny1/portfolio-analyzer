import React from 'react';
import Highcharts from 'highcharts';
import {Chart, HighchartsChart, Legend, LineSeries, Title, Tooltip, withHighcharts, XAxis, YAxis} from 'react-jsx-highcharts';
import Fmt from '../utils/formatter';

const plotOptions = {  // leaving here for future use.
};

const PortfolioChart = (props) => {
  const {portfolioName, refData} = props;

  function plotInstruments() {
    // Default only portfolio to initially chart as visible along with S&P 500.
    return Object.values(refData).map(series => {
console.log('LineSeries... ' + series.symbol + '...');
      return (
        <LineSeries
          key={series.symbol}
          id={series.name}
          marker={{enabled: false}}
          visible={(series.name === portfolioName && series.data.length > 0) || series.symbol === 'SPY'}
          name={`${Fmt.truncate(series.name, 20)} (${series.symbol})`}
          data={series.data}
        />
      );
    });
  }

  return (
    <div className='app'>
      <HighchartsChart plotOptions={plotOptions}>
        <Chart type='spline'/>
        <Title>$10,000 Investment Comparison</Title>
        <Legend />
        <Tooltip
          shared={true}
          useHTML={true}
          valueDecimals='3'
          headerFormat='<small>{point.key}</small><table>'
          pointFormat='<tr><td style="color: {series.color}">{series.name}: </td><td style="text-align: right"><b>&dollar;{point.y}K</b></td></tr>'
          footerFormat='</table>'
        />
        <XAxis type='datetime' crosshair={true} />
        <YAxis id='yAxis' labels={{format: '\u0024{value}K'}}>
          {plotInstruments()}
        </YAxis>
      </HighchartsChart>
    </div>
  );
}

export default withHighcharts(PortfolioChart, Highcharts);
