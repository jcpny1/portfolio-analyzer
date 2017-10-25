import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {
  lastSortColumn = '';      // which column was last sorted.
  lastSortReverse = false;  // was the last sort a reverse sort?

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios(false)
  }

  refreshPortfolios = () => {
    this.props.actions.loadPortfolios(true);
  }

  removePortfolio = (portfolio) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePortfolio(portfolio);
    }
  }

  sortPortfolios = (columnName) => {
    let reverseSort = this.lastSortReverse;
    if (this.lastSortColumn !== columnName) {
      this.lastSortColumn = columnName;
      reverseSort = false;
    } else {
      reverseSort = !reverseSort;
    }
    this.props.actions.sortPortfolios(this.props.portfolios, columnName, reverseSort);
    this.lastSortReverse = reverseSort;
  }

  submitPortfolio = (portfolio) => {
    (portfolio.id === '') ? this.props.actions.addPortfolio(portfolio) : this.props.actions.updatePortfolio(portfolio);
  }

  render() {
    let {portfolios} = this.props;
    let sumMarketValue = 0.0, sumTotalCost = 0.0;
    portfolios.forEach(function(portfolio) {
      sumMarketValue += parseFloat(portfolio.marketValue);
      sumTotalCost   += parseFloat(portfolio.totalCost);
    });
    const totalGainLoss = sumMarketValue - sumTotalCost;
    return (<Portfolios portfolios={portfolios} totalMarketValue={sumMarketValue} totalCost={sumTotalCost} totalGainLoss={totalGainLoss} refreshPortfolios={this.refreshPortfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
