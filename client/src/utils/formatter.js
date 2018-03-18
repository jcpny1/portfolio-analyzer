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
  series.included.forEach(si => {
    const instrumentId = si.id;
    const instrumentSymbol = si.attributes.symbol;
    const instrumentName = si.attributes.name;
    const instrumentData = []
    let shares = [];
    // for each data point for this instrument
    for (let i = series.data.length-1; i >= 0; --i) {
      const sd = series.data[i];
      if (sd.relationships.instrument.data.id === instrumentId) {
        const plotPoint = convertToPlotPoint(sd.attributes, shares)
        if (plotPoint !== null) {
          instrumentData.push(plotPoint);
        }
      }
    };
    chartData.push({'instrumentId': instrumentId, 'instrumentSymbol': instrumentSymbol, 'instrumentName': instrumentName, 'instrumentData': instrumentData});
  });
  return chartData;
};

// Convert monthly series data point to a chart plot point, beginning at START_YEAR, for now.
// Side effect: updates shares.
function convertToPlotPoint(dataPoint, shares) {
  const START_YEAR  = 2013;
  const START_VALUE = 10.0;  // in thousands

  const pointYear = parseInt(dataPoint['series-date'].substring(0,4), 10);
  if (pointYear < START_YEAR) {   // advance to start year.
    return null;
  }
  const millis = Date.parse(dataPoint['series-date']);

  const close_price = parseFloat(dataPoint['adjusted-close-price']);
  if (shares.length === 0) {
    shares.push(START_VALUE / close_price);
  }

  const dividendAmount = parseFloat(dataPoint['dividend-amount']);
  if (dividendAmount > 0.0) {
    shares[0] += (dividendAmount * shares[0]) / close_price;
  }
  return [millis, shares[0] * close_price];
}

const Fmt = {seriesDataToChartData, serverError};
export default Fmt;
