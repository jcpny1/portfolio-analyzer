// Returns a formatted server error string.
const serverError = (prefix, error) => {
  const dateOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateStamp   = new Intl.DateTimeFormat(undefined, dateOptions).format(Date.now());
  const errorString = (error.status === 400 || error.status === 500) ?
      `${prefix}: status: ${error.status} error: ${error.error}: ${error.exception} @ ${error.traces['Application Trace'][0].trace}` :
      `${prefix}: ${error}`;
      return `${errorString}\n\n\n${dateStamp}`;
};

// Convert series price data to chart-ready data points.
const seriesDataToChartData = (series, portfolioName, portfolioSymbolIds) => {
  // chartData:
  // { instrumentId: {symbol: 'symbol', name: 'name', shares: #, data: []},
  //   instrumentId: {symbol: 'symbol', name: 'name', shares: #, data: []},
  //   instrumentId: {symbol: 'symbol', name: 'name', shares: #, data: []},
  // }
  const chartData = {};
  // Init chartData for each instrument.
  series.included.forEach(seriesInstrument => {
    chartData[seriesInstrument.id] = {'symbol': seriesInstrument.attributes.symbol, 'name': seriesInstrument.attributes.name, 'shares': 0, 'data': []};
  });
  // NOTE: We will use the instrument with the latest start date as the start date for every instrument
  //       in the series so we can have a common starting point across all instruments.
  const latestStartDate = latestSeriesStartDate(series);
  // Convert each qualifying series data point to a chart data point.
  series.data.forEach(seriesInstrumentDataPoint => {
    const attributes = seriesInstrumentDataPoint.attributes;
    const relationships = seriesInstrumentDataPoint.relationships;
    const instrumentId = relationships.instrument.data.id;
    if (attributes['series-date'] >= latestStartDate) {
      const plotPoint = convertToPlotPoint(attributes, chartData[instrumentId]);
      if (plotPoint !== null) {
        chartData[instrumentId]['data'].push(plotPoint);
      }
    }
  });
  return addPortfolioSummary(chartData, portfolioName, portfolioSymbolIds);
};

// TODO: clean this up. Seems very old school.
// Creates portfolio composite series data from contents of individual instrument series data.
// Side Effects: adds portfolio data series to chartData.
// Returns chartData.
function addPortfolioSummary(chartData, portfolioName, portfolioSymbolIds) {
  // Insert portfolio 'instrument'.
  chartData[0] = {'symbol': "Portfolio", 'name': portfolioName, 'data': []};
  // Don't process data points if portfolio has no positions.
  if (portfolioSymbolIds.length === 0) {
    return chartData;
  }
  // Copy another instrument's series dates to the portfolio's dates.
  const anySeriesKey = Object.keys(chartData)[1];
  const anySeriesKeyData = chartData[anySeriesKey]['data'];
  chartData[0]['data'] = anySeriesKeyData.map(dataPoint => {return [dataPoint[0], 0.0]});    // MAYBE PUT THIS IN CONVERTPOINT CALL LOOP ABOVE.
  // Since we are summing all instruments values, we need the number of instruments so we can divide down to the original starting amount.
  let symbolCount = portfolioSymbolIds.length;
  // Sum all instruments' data points into the portfolio instrument.
  portfolioSymbolIds.forEach(portfolioSymbolId => {
    const symbolSeries = chartData[portfolioSymbolId];
    if (symbolSeries) {
      symbolSeries['data'].forEach((dataPoint,i) => {
        chartData[0]['data'][i][1] += dataPoint[1];
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
function convertToPlotPoint(dataPoint, chartDataInstrument) {
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
// Assumes series data is grouped by instrument and is in series-date descending order.
// That is, the first data point we encounter for each instrument will be its earliest data point.
function latestSeriesStartDate(series) {
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

// If string is longer than length len, truncate it and add an ellipsis.
const truncate = (string, len) => {
  return (string.length > len) ? string.substr(0, len-1) + '...' : string;
}

const Fmt = {seriesDataToChartData, serverError, truncate};
export default Fmt;
