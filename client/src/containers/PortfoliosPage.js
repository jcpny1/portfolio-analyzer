import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/portfolioActions.js';
import Portfolio from './classes/Portfolio';
import {Portfolios} from '../components/Portfolios';

class PortfoliosPage extends Component {
  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios(false, this.props.sortFn)
  }

  refreshPortfolios = () => {
    this.props.actions.loadPortfolios(true, this.props.sortFn);
  }

  removePortfolio = (portfolioId) => {
    const deleteFn = this.props.actions.deletePortfolio;
    return function() {
      deleteFn(portfolioId);
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
    const {sumMarketValue, sumTotalCost, sumDayChange, sumGainLoss} = Portfolio.computeAccountSummaries(portfolios);
    const sortTerms = sortFn();
    return (<Portfolios portfolios={portfolios} emptyPortfolio={Portfolio.newPortfolio()} updatingPortfolio={updatingPortfolio} totalCost={sumTotalCost} totalDayChange={sumDayChange} totalGainLoss={sumGainLoss} totalMarketValue={sumMarketValue} refreshPortfolios={this.refreshPortfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios} sortColName={sortTerms.primary.property} sortDirection={sortTerms.primary.direction}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sortFn: state.portfolios.sortFn, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
