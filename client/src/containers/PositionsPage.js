import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as positionActions from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';
import Position  from './classes/Position';
import Positions from '../components/Positions';

class PositionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolioId: parseInt(this.props.match.params.id, 10),
    };
  }

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios(false, this.props.sortFn)
  }

  refreshPortfolio = (portfolio) => {
    this.props.actions.loadPortfolios(true, this.props.sortFn);
  }

  removePosition = (portfolioId, positionId) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(portfolioId, positionId, this.props.sortFn);
    }
  }

  sortPositions = (columnName) => {
    this.props.actions.sortPositions(this.props.portfolios, columnName, this.props.sortFn);
  }

  submitPosition = (position) => {
    (position.id === '') ? this.props.actions.addPosition(position, this.props.sortFn) : this.props.actions.updatePosition(position, this.props.sortFn);
  }

  render() {
    const {portfolios, sortFn, updatingPortfolio} = this.props;
    let portfolio = portfolios.find((portfolio) => {return portfolio.id === this.state.portfolioId});
    if (portfolio) {  // may be null until props.portfolios is loaded.
      const sortTerms = sortFn();
      return (<Positions portfolio={portfolio} emptyPosition={Position.newPosition(this.state.portfolioId)} updatingPortfolio={updatingPortfolio} refreshPortfolio={this.refreshPortfolio} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions} sortColName={sortTerms.secondary.property} sortDirection={sortTerms.secondary.direction}/>);
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sortFn: state.portfolios.sortFn, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
