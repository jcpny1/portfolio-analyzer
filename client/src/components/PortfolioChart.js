import React from 'react';
import Highcharts from 'highcharts';
import {HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries} from 'react-jsx-highcharts';

const plotOptions = {
  series: { type: 'line' },
};

const PortfolioChart = (props) => {
  const {portfolio, refData} = props;

  function plotInstruments() {
    return refData.map(series => {
      return <LineSeries key={series.instrumentId} id={series.instrumentId} name={`${series.instrumentName} (${series.instrumentSymbol})`} data={series.instrumentData} />;
    });
  }

  return (
    <div className='app'>
      <HighchartsChart plotOptions={plotOptions}>
        <Chart />
        <Title>{portfolio.name}</Title>
        <Subtitle>$10,000 Investment Comparison</Subtitle>
        <Legend layout='vertical' align='center' verticalAlign='bottom' />
        <XAxis type='datetime'>
          <XAxis.Title>Date</XAxis.Title>
        </XAxis>
        <YAxis id='number'>
          <YAxis.Title>Value</YAxis.Title>
          {plotInstruments()}
        </YAxis>
      </HighchartsChart>
    </div>
  );
}

export default withHighcharts(PortfolioChart, Highcharts);
