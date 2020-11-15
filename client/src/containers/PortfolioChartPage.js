import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as portfolioActions from '../actions/portfolioActions';
import ChartData from '../classes/ChartData';
import Series from '../classes/Series';
import Fmt from '../utils/formatter';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import * as Request from '../utils/request';
import PortfolioChart from '../components/PortfolioChart';

// This class handles display window of the Portfolio chart.
class PortfolioChartPage extends Component {

  static CHART_RANGE = 5;  // years

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      refData: [],
    }
  }

  UNSAFE_componentWillMount() {
    this.resetComponent();
  }

  refreshData = () => {
    const {portfolio} = this.props;
    const portfolioSymbolIds = portfolio.positions.map(position => position.instrument.id);
    const portfolioSymbols = portfolio.positions.map(position => position.instrument.symbol);
    const symbols = [...new Set(portfolioSymbols.concat(Series.ETF_SYMBOLS))].join(',');  // uniquify portfolio and ETF symbol lists and turn into comma-separated string.
    const dateNow = new Date(Date.now());
    const start_date = new Date(dateNow.getFullYear() - PortfolioChartPage.CHART_RANGE, dateNow.getMonth(), dateNow.getDate()).toJSON();
    const end_date = dateNow.toJSON();
    Request.seriesFetch(symbols, start_date, end_date, series => {
      if ('error' in series) {
        alert(Fmt.serverError('Refresh Series', series.error));
      } else {
        const chartData = ChartData.seriesDataToChartData(series, portfolio.name, portfolioSymbolIds);
        this.setState({refData: chartData});
      }
    });
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
        closeIcon
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} id='portfolioChart' link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        size={'large'}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content={portfolio.nameToHTML()} icon='chart line' size='small'/></Modal.Header>
        <Modal.Content><PortfolioChart refData={refData} portfolioName={portfolio.name}/></Modal.Content>
        <Modal.Actions><Button floated='left' color='red' onClick={this.handleCancel}>Close</Button></Modal.Actions>
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
