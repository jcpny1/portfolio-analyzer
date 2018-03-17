import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as portfolioActions from '../actions/portfolioActions.js';
import PropTypes from 'prop-types';
import Fmt from '../utils/formatter';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import * as Request from '../utils/request';
import PortfolioChart from '../components/PortfolioChart';

// This class handles display window of the Portfolio chart.
class PortfolioChartPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      refData: [],
    }
  }

  componentWillMount() {
    this.resetComponent();
  }

  refreshData = () => {
    Request.seriesRefresh('SPY', series => {
      if ('error' in series) {
        alert(Fmt.serverError('Refresh Series', series.error));
      } else {
// for each instrument in included,
//   for each data point with this instruments
//     push to array
//   push array to refData

        const chartData = [];

// TODO we're making a pass over all instruments' data points for every instrument. Better to do in one pass.

        series.included.forEach(si => {
          const instrumentId = si.id;
          const instrumentSymbol = si.attributes.symbol;
          const instrumentName = si.attributes.name;
          const instrumentData = []
          let shares = [];
          for (let i = series.data.length-1; i >= 0; --i) {
            const sd = series.data[i];
            if (sd.relationships.instrument.data.id === instrumentId) {
              const plotPoint = this.convertToPlotPoint(sd.attributes, shares)
              if (plotPoint !== null) {
                instrumentData.push(plotPoint);
              }
            }
          };
          chartData.push({'instrumentId': instrumentId, 'instrumentSymbol': instrumentSymbol, 'instrumentName': instrumentName, 'instrumentData': instrumentData});
        });

        this.setState({refData: chartData});
      }
    });
  }

  static START_YEAR  = 2008;
  static START_VALUE = 10000.0;

  // Convert monthly series data point to a chart plot point, beginning at START_YEAR, for now.
  // Side effect: updates shares.
  convertToPlotPoint = (dataPoint, shares) => {
    const pointYear = parseInt(dataPoint['series-date'].substring(0,4), 10);
    if (pointYear < PortfolioChartPage.START_YEAR) {   // advance to start year.
      return null;
    }
    const millis = Date.parse(dataPoint['series-date']);
    const close_price = parseFloat(dataPoint['adjusted-close-price']);
    if (shares.length === 0) {
      shares.push(PortfolioChartPage.START_VALUE / close_price);
    }
    const dividendAmount = parseFloat(dataPoint['dividend-amount']);
    if (dividendAmount > 0.0) {
      shares[0] += (dividendAmount * shares[0]) / close_price;
    }
    return [millis, shares[0] * close_price];
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleOpen = () => {
    this.refreshData();
    this.setState({modalOpen: true});
  }

  render() {
    const {iconColor, iconName, portfolio, tooltip} = this.props;
    const {refData, modalOpen} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} id='portfolioChart' link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Portfolio Chart' icon='chart line' size='small'/></Modal.Header>
        <Modal.Content><PortfolioChart portfolio={portfolio} refData={refData}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

PortfolioChartPage.propTypes = {
  iconColor: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  portfolio: PropTypes.object.isRequired,
  tooltip: PropTypes.string.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(portfolioActions, dispatch)};
}

export default connect(undefined, mapDispatchToProps)(PortfolioChartPage);
