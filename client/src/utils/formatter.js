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
const seriesDataToChartData = (series, portfolioName, portfolioSymbols) => {
  const chartData = [];
  // NOTE: We will use the instrument with the latest start date as the start date for every instrument in the series
  // so we can have a common starting point across all instruments.
  const latestStartDate = latestSeriesStartDate(series);
  // TODO we're making a pass over all instruments' data points for every instrument.
  // Better to do in one pass for all instruments.
  // For now it's ok since the time lost is small compared to the time to get the data from the server.
  series.included.forEach(seriesInstrument => {
    const instrumentData = [];
    const instrumentId = seriesInstrument.id;
    const sharesHeld = [];
    series.data.forEach(seriesInstrumentDataPoint => {
      const attributes = seriesInstrumentDataPoint.attributes;
      const relationships = seriesInstrumentDataPoint.relationships;
      if ((relationships.instrument.data.id === instrumentId) && (attributes['series-date'] >= latestStartDate)) {
        const plotPoint = convertToPlotPoint(attributes, sharesHeld)
        if (plotPoint !== null) {
          instrumentData.push(plotPoint);
        }
      }
    });
    chartData.push({'instrumentId': instrumentId, 'instrumentSymbol': seriesInstrument.attributes.symbol, 'instrumentName': seriesInstrument.attributes.name, 'instrumentData': instrumentData});
  });
  return addPortfolioSummary(chartData, portfolioName, portfolioSymbols);
};

// TODO: clean this up. Seems very old school.
// Creates portfolio composite series data from contents of individual instrument series data.
// Side Effects: adds portfolio data series to chartData.
// Returns chartData.
function addPortfolioSummary(chartData, portfolioName, portfolioSymbols) {
  const portfolioChart = { instrumentId: '', instrumentSymbol: 'Portfolio', instrumentName: portfolioName, instrumentData: [] };
  chartData[0].instrumentData.forEach((dataPoint) => { portfolioChart.instrumentData.push([dataPoint[0], 0.0]) });
  let symbolCount = portfolioSymbols.length;
  portfolioSymbols.forEach(portfolioSymbol => {
    const symbolSeries = chartData.find(series => series.instrumentSymbol === portfolioSymbol);
    if (symbolSeries) {
      symbolSeries.instrumentData.forEach((dataPoint,i) => {
        portfolioChart.instrumentData[i][1] += dataPoint[1];
      });
    } else {
      symbolCount -= 1;  // Need to account for when a portfolio symbol is not returned in series data.
    }
  });
  portfolioChart.instrumentData.forEach(dataPoint => {
    dataPoint[1] /= symbolCount;
  });
  chartData.unshift(portfolioChart);
  return chartData;
}

// Convert monthly series data point to a chart plot point, beginning at START_YEAR, for now.
// Side effect: updates sharesHeld.
function convertToPlotPoint(dataPoint, sharesHeld) {
  const START_VALUE = 10.0;  // in thousands
  const closePrice = parseFloat(dataPoint['adjusted-close-price']);
  if (sharesHeld.length === 0) {
    sharesHeld.push(START_VALUE / closePrice);
  }
  const dividendAmount = parseFloat(dataPoint['dividend-amount']);
  if (dividendAmount > 0.0) {
    sharesHeld[0] += (dividendAmount * sharesHeld[0]) / closePrice;
  }
  return [Date.parse(dataPoint['series-date']), sharesHeld[0] * closePrice];
}

// Of all the instruments in the series, return the series-date of the instrument series that starts the latest.
// Assumes series data is grouped by instrument and is in series-date descending order.
// That is, the first data point we encounter for each instrument will be its earliest data point.
function latestSeriesStartDate(series) {
  let latestStartDate = '0000-00-00';
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
