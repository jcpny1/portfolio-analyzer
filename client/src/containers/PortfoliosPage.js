import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as portfolioActions from '../actions/portfolioActions.js';
import Portfolio from '../classes/Portfolio';
import {Portfolios} from '../components/Portfolios';

class PortfoliosPage extends Component {
  componentDidMount() {
    this.props.portfolios.length || this.props.actions.portfoliosLoad(false, this.props.sortFn)
  }

  refreshPortfolios = () => {
    this.props.actions.portfoliosLoad(true, this.props.sortFn);
  }

  removePortfolio = (portfolioId) => {
    const deleteFn = this.props.actions.portfolioDelete;
    return function() {
      deleteFn(portfolioId);
    }
  }

  sortPortfolios = (columnName) => {
    this.props.actions.portfoliosSort(this.props.portfolios, columnName, this.props.sortFn);
  }

  render() {
    const {portfolios, sortFn, updatingPortfolio, userLocale} = this.props;
    const {sumCost, sumDayChange, sumGainLoss, sumMarketValue} = Portfolio.accountSummary(portfolios);
    const sortTerms = sortFn();
    return (<Portfolios portfolios={portfolios} updatingPortfolio={updatingPortfolio} totalCost={sumCost} totalDayChange={sumDayChange} totalGainLoss={sumGainLoss} totalMarketValue={sumMarketValue} refreshPortfolios={this.refreshPortfolios} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios} sortColName={sortTerms.primary.property} sortDirection={sortTerms.primary.direction} userLocale={userLocale}/>);
  }
}

PortfoliosPage.propTypes = {
  actions: PropTypes.object.isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortFn: PropTypes.func.isRequired,
  updatingPortfolio: PropTypes.bool.isRequired,
  userLocale: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sortFn: state.portfolios.sortFn, updatingPortfolio: state.portfolios.updatingPortfolio, userLocale: state.users.user.locale};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(portfolioActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
