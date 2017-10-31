import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionUtils from '../actions/actionUtils';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortFn: ActionUtils.columnSorter(this.props.actions.sortPortfolios),
    };
  }

  static newPortfolio = {
    id: '',
    name: '',
    positions: [],
    dayChange: null,
    gainLoss: null,
    marketValue: null,
    totalCost: null,
  };

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios(false)
  }

  refreshPortfolios = () => {
    this.props.actions.loadPortfolios(true);
  }

  removePortfolio = (portfolioId) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePortfolio(portfolioId);
    }
  }

  sortPortfolios = (columnName) => {
    this.state.sortFn(this.props.portfolios, columnName);
  }

  submitPortfolio = (portfolio) => {
    (portfolio.id === '') ? this.props.actions.addPortfolio(portfolio) : this.props.actions.updatePortfolio(portfolio);
  }

  render() {
    const {portfolios, updatingPortfolio} = this.props;
    const {sumMarketValue, sumTotalCost, sumDayChange, sumGainLoss} = ActionUtils.computeAccountSummaries(portfolios);
    return (<Portfolios portfolios={portfolios} emptyPortfolio={PortfoliosPage.newPortfolio} updatingPortfolio={updatingPortfolio} totalCost={sumTotalCost} totalDayChange={sumDayChange} totalGainLoss={sumGainLoss} totalMarketValue={sumMarketValue} refreshPortfolios={this.refreshPortfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
