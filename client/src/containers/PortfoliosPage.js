import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionUtils from '../actions/actionUtils';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {
  static newPortfolio = {
    id: '',
    name: '',
    positions: [],
  };

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios(false, this.props.sortFn)
  }

  refreshPortfolios = () => {
    this.props.actions.loadPortfolios(true, this.props.sortFn);
  }

  removePortfolio = (portfolioId) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePortfolio(portfolioId);
    }
  }

  sortPortfolios = (columnName) => {
    this.props.actions.sortPortfolios(this.props.portfolios, columnName, this.props.sortFn);
  }

  submitPortfolio = (portfolio) => {
    (portfolio.id === '') ? this.props.actions.addPortfolio(portfolio) : this.props.actions.updatePortfolio(portfolio);
  }

  render() {
    const {portfolios, sortFn, updatingPortfolio} = this.props;
    const {sumMarketValue, sumTotalCost, sumDayChange, sumGainLoss} = ActionUtils.computeAccountSummaries(portfolios);
    const sortTerms = sortFn();
    return (<Portfolios portfolios={portfolios} emptyPortfolio={PortfoliosPage.newPortfolio} updatingPortfolio={updatingPortfolio} totalCost={sumTotalCost} totalDayChange={sumDayChange} totalGainLoss={sumGainLoss} totalMarketValue={sumMarketValue} refreshPortfolios={this.refreshPortfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios} sortColName={sortTerms.portfolios.property} sortDirection={sortTerms.portfolios.direction}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sortFn: state.portfolios.sortFn, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
