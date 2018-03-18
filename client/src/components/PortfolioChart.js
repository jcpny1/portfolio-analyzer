import React from 'react';
import Highcharts from 'highcharts';
import {Chart, HighchartsChart, Legend, LineSeries, Subtitle, Title, Tooltip, withHighcharts, XAxis, YAxis} from 'react-jsx-highcharts';

const plotOptions = {
};

const PortfolioChart = (props) => {
  const {portfolio, refData} = props;

  function plotInstruments() {
    return refData.map(series => {
      return (
        <LineSeries
          key={series.instrumentSymbol}
          id={series.instrumentName}
          marker={{enabled: false}}
          name={`${series.instrumentName} (${series.instrumentSymbol})`}
          data={series.instrumentData}
        />
      );
    });
  }

  return (
    <div className='app'>
      <HighchartsChart plotOptions={plotOptions}>
        <Chart type='spline'/>
        <Title>{portfolio.name}</Title>
        <Subtitle>$10,000 Investment Comparison</Subtitle>
        <Legend />
        <Tooltip
          shared='true'
          useHTML='true'
          valueDecimals='3'
          headerFormat='<small>{point.key}</small><table>'
          pointFormat='<tr><td style="color: {series.color}">{series.name}: </td><td style="text-align: right"><b>&dollar;{point.y}K</b></td></tr>'
          footerFormat='</table>'
        />
        <XAxis type='datetime' crosshair='true'/>
        <YAxis id='yAxis' labels={{format: '$\u0000{value}K'}}>{plotInstruments()}</YAxis>
      </HighchartsChart>
    </div>
  );
}

export default withHighcharts(PortfolioChart, Highcharts);
