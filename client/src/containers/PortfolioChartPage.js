import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _cloneDeep from 'lodash.clonedeep';
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
      diaData: [],
      spyData: [],
      urthData: [],
    }
  }

  componentWillMount() {
    this.resetComponent();
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    Request.seriesRefresh(series => {
      if ('error' in series) {
        alert(Fmt.serverError('Refresh Series', series.error));
      } else {
        const diaData = series.filter(s => s.instrument.symbol === 'DIA');
        if (diaData) {
          this.setState({diaData: this.convertToPlotPoints(diaData)});
        }
        const spyData = series.filter(s => s.instrument.symbol === 'SPY');
        if (spyData) {
          this.setState({spyData: this.convertToPlotPoints(spyData)});
        }
        const urthData = series.filter(s => s.instrument.symbol === 'URTH');
        if (urthData) {
          this.setState({urthData: this.convertToPlotPoints(urthData)});
        }
      }
    });
  }

  static START_YEAR  = 2008;
  static START_VALUE = 10000.0;

  // Convert monthly series data to chart plot points, beginning at START_YEAR, for now.
  convertToPlotPoints = (dataPoints) => {
    let plotPoints = [];
    let shares = null;
    for (let i = dataPoints.length-1; i >= 0; --i) {
      let pointYear = parseInt(dataPoints[i].series_date.substring(0,4), 10);
      if (pointYear < PortfolioChartPage.START_YEAR) {   // advance to start year.
        continue;
      }
      let millis = Date.parse(dataPoints[i].series_date);
      let close_price = parseFloat(dataPoints[i].adjusted_close_price);
      if (shares === null) {
        shares = PortfolioChartPage.START_VALUE / close_price;
      }
// console.log('date: ' + dataPoints[i].series_date + ' close: ' + close_price + ' shares: ' + shares.toFixed(4) + ' div: ' + dataPoints[i].dividend_amount + ' total: ' + (shares*close_price).toFixed(4));
      if (dataPoints[i].dividend_amount > 0.0) {
        shares += (dataPoints[i].dividend_amount * shares) / close_price;
      }
      plotPoints.push([millis, shares * close_price]);
    }
    return plotPoints;
  }


  resetComponent = () => {
    this.setState({
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    const {editedPortfolio} = this.state;
    let newPortfolio = _cloneDeep(editedPortfolio);
    newPortfolio[name] = value;
    this.setState({editedPortfolio: newPortfolio});
  }

  handleOpen = () => {
    const {portfolio} = this.props;
    this.setState({editedPortfolio: _cloneDeep(portfolio), modalOpen: true});
  }

  handleSubmit = () => {
    const {actions} = this.props;
    const {editedPortfolio} = this.state;
    editedPortfolio.id ? actions.portfolioUpdate(editedPortfolio) : actions.portfolioAdd(editedPortfolio);
    this.resetComponent();
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {diaData, editedPortfolio, modalOpen, spyData, urthData} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} id='portfolioEdit' link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Portfolio Chart' icon='chart line' size='small'/></Modal.Header>
        <Modal.Content><PortfolioChart portfolio={editedPortfolio} diaData={diaData} spyData={spyData} urthData={urthData}/></Modal.Content>
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
