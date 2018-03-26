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
const seriesDataToChartData = (series) => {
  const chartData = [];
  // TODO we're making a pass over all instruments' data points for every instrument.
  // Better to do in one pass for all instruments.
  // For now it's ok since the time lost is small compared to the time to get the data from the server.
  series.included.forEach(seriesInstrument => {
    const instrumentId = seriesInstrument.id;
    const instrumentSymbol = seriesInstrument.attributes.symbol;
    const instrumentName = seriesInstrument.attributes.name;
    const instrumentData = []
    const sharesHeld = [];
    series.data.forEach(seriesInstrumentDataPoint => {
      if (seriesInstrumentDataPoint.relationships.instrument.data.id === instrumentId) {
        const plotPoint = convertToPlotPoint(seriesInstrumentDataPoint.attributes, sharesHeld)
        if (plotPoint !== null) {
          instrumentData.push(plotPoint);
        }
      }
    });
    chartData.push({'instrumentId': instrumentId, 'instrumentSymbol': instrumentSymbol, 'instrumentName': instrumentName, 'instrumentData': instrumentData});
  });
  return chartData;
};

// Convert monthly series data point to a chart plot point, beginning at START_YEAR, for now.
// Side effect: updates sharesHeld.
function convertToPlotPoint(dataPoint, sharesHeld) {
  const START_YEAR  = 2013;
  const START_VALUE = 10.0;  // in thousands

  const pointYear = parseInt(dataPoint['series-date'].substring(0,4), 10);
  if (pointYear < START_YEAR) {   // advance to start year.
    return null;
  }
  const millis = Date.parse(dataPoint['series-date']);

  const close_price = parseFloat(dataPoint['adjusted-close-price']);
  if (sharesHeld.length === 0) {
    sharesHeld.push(START_VALUE / close_price);
  }

  const dividendAmount = parseFloat(dataPoint['dividend-amount']);
  if (dividendAmount > 0.0) {
    sharesHeld[0] += (dividendAmount * sharesHeld[0]) / close_price;
  }
  return [millis, sharesHeld[0] * close_price];
}

const Fmt = {seriesDataToChartData, serverError};
export default Fmt;
