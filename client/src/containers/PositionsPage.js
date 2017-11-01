import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as positionActions from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';
import Positions from '../components/Positions';
import PortfoliosPage from './PortfoliosPage';

class PositionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolioId: parseInt(this.props.match.params.id, 10),
    };
  }

  newPosition = () => {
    return {
      portfolio_id: this.state.portfolioId,
      id: '',
      stock_symbol: {},
      quantity: '',
      cost: '',
      date_acquired: '',
    }
  };

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios(false)
  }

  refreshPortfolio = (portfolio) => {
    this.props.actions.loadPortfolios(true);
  }

  removePosition = (portfolioId, positionId) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(portfolioId, positionId);
    }
  }

  sortPositions = (columnName) => {
    const portfolio = this.props.portfolios.find((portfolio) => {return portfolio.id === this.state.portfolioId});
    this.props.actions.sortPositions(portfolio, columnName, this.props.sorting);
  }

  submitPosition = (position) => {
    (position.id === '') ? this.props.actions.addPosition(position) : this.props.actions.updatePosition(position);
  }

  render() {
    const {portfolios, sorting, stockSymbols, updatingPortfolio} = this.props;
    let portfolio = portfolios.find((portfolio) => {return portfolio.id === this.state.portfolioId});
    if (!portfolio) {  // may be null until props.portfolios is loaded.
      portfolio = PortfoliosPage.newPortfolio;
    }
    return (<Positions portfolio={portfolio} emptyPosition={this.newPosition()} stockSymbols={stockSymbols} updatingPortfolio={updatingPortfolio} refreshPortfolio={this.refreshPortfolio} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions} sortColName={sorting.colName} sortDirection={sorting.colDirection}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sorting: state.portfolios.sorting.positions, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
