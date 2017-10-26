import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionUtils from '../actions/actionUtils';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {

  static newPortfolio = {id: '', name: ''};

  constructor(props) {
    super(props);
    this.state = {portfoliosSorter: ActionUtils.columnSorter(this.props.actions.sortPortfolios)};
  }

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
    this.state.portfoliosSorter(this.props.portfolios, columnName);
  }

  submitPortfolio = (portfolio) => {
    (portfolio.id === '') ? this.props.actions.addPortfolio(portfolio) : this.props.actions.updatePortfolio(portfolio);
  }

  render() {
    const {portfolios, updatingPortfolio} = this.props;
    let sumMarketValue = 0.0, sumTotalCost = 0.0;
    portfolios.forEach(function(portfolio) {
      sumMarketValue += portfolio.marketValue;
      sumTotalCost   += portfolio.totalCost;
    });
    const totalGainLoss = sumMarketValue - sumTotalCost;
    return (<Portfolios portfolios={portfolios} emptyPortfolio={PortfoliosPage.newPortfolio} updatingPortfolio={updatingPortfolio} totalMarketValue={sumMarketValue} totalCost={sumTotalCost} totalGainLoss={totalGainLoss} refreshPortfolios={this.refreshPortfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
