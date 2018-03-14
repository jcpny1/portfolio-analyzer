import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _cloneDeep from 'lodash.clonedeep';
import * as portfolioActions from '../actions/portfolioActions.js';
import PropTypes from 'prop-types';
import Decimal from '../classes/Decimal';
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
      spyData: [],
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
        const spyData = series.filter(s => s.instrument.symbol === 'SPY');
        if (spyData) {
          this.setState({spyData: this.convertToYearly(spyData)});
        }
      }
    });
  }

  // Convert monthly series to annual series, beginning in 2010 for now.
  convertToYearly = (dataPoints) => {
    let annualPoints = [];
    for (let i = dataPoints.length-1; i >= 0; --i) {
      let pointYearIndex = parseInt(dataPoints[i].series_date.substring(0,4)) - 2010
      if (pointYearIndex >= 0) {
        annualPoints[pointYearIndex] = parseFloat(dataPoints[i].adjusted_close_price)
      }
    }

    // TODO convert missing values to null.
    // TODO use first legit value, not necessarily [0].
    let initialShares = 10000.0 / annualPoints[0];
    let annualValues = [];
    annualValues[0] = 10000.0;
    for (let i = 1; i < annualPoints.length; ++i) {
      annualValues[i] = initialShares * annualPoints[i];
    }

return annualValues;

    // return [10000, 20000, 40000, 80000, 120000, 160000, 180000, 190000];
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
    const {editedPortfolio, modalOpen, spyData} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} id='portfolioEdit' link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Portfolio Chart' icon='chart line' size='small'/></Modal.Header>
        <Modal.Content><PortfolioChart portfolio={editedPortfolio} spyData={spyData}/></Modal.Content>
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
