// This class is used to hold and format numeric values.
export default class ChartData {
  // Convert series price data to chart-ready data points.
  static seriesDataToChartData(series, portfolioName, portfolioSymbolIds) {
    // chartData:
    // { instrumentId: {symbol: 'symbol', name: 'name', shares: #, data: []},
    //   instrumentId: {symbol: 'symbol', name: 'name', shares: #, data: []},
    //   instrumentId: {symbol: 'symbol', name: 'name', shares: #, data: []},
    // }
    const chartData = {};
    if (series.data.length === 0) {  // Protect against no series data available.
      return chartData;
    }
    // Init chartData for each instrument.
    series.included.forEach(seriesInstrument => {
      chartData[seriesInstrument.id] = {'symbol': seriesInstrument.attributes.symbol, 'name': seriesInstrument.attributes.name, 'shares': 0, 'data': []};
    });
    // NOTE: We will use the instrument with the latest start date as the start date for every instrument
    //       in the series so we can have a common starting point across all instruments.
    const latestStartDate = ChartData.latestSeriesStartDate(series);
    // Convert each qualifying series data point to a chart data point.
    series.data.forEach(seriesInstrumentDataPoint => {
      const attributes = seriesInstrumentDataPoint.attributes;
      const relationships = seriesInstrumentDataPoint.relationships;
      const instrumentId = relationships.instrument.data.id;
      if (attributes['series-date'] >= latestStartDate) {
        const plotPoint = ChartData.convertToPlotPoint(attributes, chartData[instrumentId]);
        if (plotPoint !== null) {
          chartData[instrumentId]['data'].push(plotPoint);
        }
      }
    });
    return ChartData.addPortfolioSummary(chartData, portfolioName, portfolioSymbolIds);
  };

  // Creates portfolio composite series data from contents of individual instrument series data.
  // NOTE: Due to data feed quirks, we need to trim end dates to a date where all instruments still have data.
  // The AV data feed is sometimes up-to-date and sometimes not.
  // Maybe the last monthly data point is today, or yesterday, or maybe it's EOM from last month.
  // By using series.length as a measure of date range, we assume series data has been normalized to a common start date by this point.
  // If we didn't adjust, our portfolio value would not be correct where a particular date is missing.
  // Also, the AV feed is missing monthly series data for some instruments.
  // Side Effects: adds portfolio data series to chartData.
  // Returns chartData.
  static addPortfolioSummary(chartData, portfolioName, portfolioSymbolIds) {
    let shortestSeries = Number.MAX_SAFE_INTEGER; // Find series with the earliest end date.
    Object.values(chartData).forEach(symbolSeries => {
      if (symbolSeries['data'].length < shortestSeries) {
        shortestSeries = symbolSeries['data'].length;
      }
    });

    // Insert portfolio 'instrument', so it appears first in chart legend.
    chartData[0] = {'symbol': "Portfolio", 'name': portfolioName, 'data': []};

    // Sum each instrument's data points into the portfolio instrument.
    let symbolCount = portfolioSymbolIds.length;  // Keep track of how many instruments were found to have series data. Used to calc adjusted portfolio value.
    portfolioSymbolIds.forEach(portfolioSymbolId => {
      const symbolSeries = chartData[portfolioSymbolId];
      if (symbolSeries) {
        symbolSeries['data'].forEach((dataPoint,i) => {
          if (i < shortestSeries) {
            if (i === chartData[0]['data'].length) {
              chartData[0]['data'].push([dataPoint[0], dataPoint[1]]);
            } else {
              chartData[0]['data'][i][1] += dataPoint[1];
            }
          }
        });
      } else {
        symbolCount -= 1;  // Need to account for when a portfolio symbol is not returned in series data.
      }
    });

    // Rebase the portfolio amounts to the original starting amount.
    chartData[0]['data'].forEach(dataPoint => {
      dataPoint[1] /= symbolCount;
    });
    return chartData;
  }

  // Convert monthly series data point to a chart plot point, beginning at START_YEAR, for now.
  // Side effect: updates sharesHeld.
  static convertToPlotPoint(dataPoint, chartDataInstrument) {
    const START_VALUE = 10.0;  // in thousands
    const closePrice = parseFloat(dataPoint['adjusted-close-price']);
    let sharesHeld = chartDataInstrument['shares'];
    // Establish beginning sharesHeld.
    if (sharesHeld === 0) {
      sharesHeld = START_VALUE / closePrice;
      chartDataInstrument['shares'] = sharesHeld;
    }
    // If there was a dividend, reinvest it in more shares.
    const dividendAmount = parseFloat(dataPoint['dividend-amount']);
    if (dividendAmount > 0.0) {
      sharesHeld += (dividendAmount * sharesHeld) / closePrice;
      chartDataInstrument['shares'] = sharesHeld;
    }
    // Return the datapoint date and value.
    return [Date.parse(dataPoint['series-date']), sharesHeld * closePrice];
  }

  // Of all the instruments in the series, return the series-date of the instrument series that starts the latest.
  // Assumes series data is grouped by instrument and is in series-date ascending order.
  // That is, the first data point we encounter for each instrument will be its earliest data point.
  static latestSeriesStartDate(series) {
    let latestStartDate = '';
    let currentInstrumentId = null;
    series.data.forEach(seriesInstrumentDataPoint => {
      const seriesInstrumentId = seriesInstrumentDataPoint.relationships.instrument.data.id;
      if (seriesInstrumentId !== currentInstrumentId) {
        currentInstrumentId = seriesInstrumentId;
        const dataPointStartDate = seriesInstrumentDataPoint.attributes['series-date'];
        if (dataPointStartDate > latestStartDate) {
          latestStartDate = dataPointStartDate;
        }
      }
    });
    return latestStartDate;
  }
}
