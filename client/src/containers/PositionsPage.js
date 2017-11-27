import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as positionActions  from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';
import Position  from '../classes/Position';
import {Positions} from '../components/Positions';

class PositionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolioId: parseInt(this.props.match.params.id, 10),
    };
  }

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.portfoliosLoad(false, this.props.sortFn)
  }

  portfolioRefresh = (portfolio) => {
    this.props.actions.portfoliosLoad(true, this.props.sortFn);
  }

  positionRemove = (portfolioId, positionId) => {
    const deleteFn = this.props.actions.positionDelete;
    const sortFn   = this.props.sortFn;
    return function() {
      deleteFn(portfolioId, positionId, sortFn);
    }
  }

  positionsSort = (columnName) => {
    this.props.actions.positionsSort(this.props.portfolios, columnName, this.props.sortFn);
  }

  positionSubmit = (position) => {
    (position.id === '') ? this.props.actions.positionAdd(position, this.props.sortFn) : this.props.actions.positionUpdate(position, this.props.sortFn);
  }

  render() {
    const {portfolios, sortFn, updatingPortfolio, userLocale} = this.props;
    let portfolio = portfolios.find((portfolio) => {return portfolio.id === this.state.portfolioId});
    if (portfolio) {  // may be null until props.portfolios is loaded.
      const sortTerms = sortFn();
      return (<Positions portfolio={portfolio} emptyPosition={new Position(this.state.portfolioId)} updatingPortfolio={updatingPortfolio} portfolioRefresh={this.portfolioRefresh} onClickSubmit={this.positionSubmit} onClickRemove={this.positionRemove} onClickColHeader={this.positionsSort} sortColName={sortTerms.secondary.property} sortDirection={sortTerms.secondary.direction} userLocale={userLocale}/>);
    } else {
      return null;
    }
  }
}

PositionsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortFn: PropTypes.func.isRequired,
  updatingPortfolio: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sortFn: state.portfolios.sortFn, updatingPortfolio: state.portfolios.updatingPortfolio, userLocale: state.users.user.locale};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
