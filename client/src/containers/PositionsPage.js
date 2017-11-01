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
    this.props.portfolios.length || this.props.actions.loadPortfolios(false, this.props.sorting)
  }

  refreshPortfolio = (portfolio) => {
    this.props.actions.loadPortfolios(true, this.props.sorting);
  }

  removePosition = (portfolioId, positionId) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(portfolioId, positionId, this.props.sorting);
    }
  }

  sortPositions = (columnName) => {
    this.props.actions.sortPositions(this.props.portfolios, columnName, this.props.sorting);
  }

  submitPosition = (position) => {
    (position.id === '') ? this.props.actions.addPosition(position, this.props.sorting) : this.props.actions.updatePosition(position, this.props.sorting);
  }

  render() {
    const {portfolios, sorting, updatingPortfolio} = this.props;
    let portfolio = portfolios.find((portfolio) => {return portfolio.id === this.state.portfolioId});
    if (!portfolio) {  // may be null until props.portfolios is loaded.
      portfolio = PortfoliosPage.newPortfolio;
    }
    return (<Positions portfolio={portfolio} emptyPosition={this.newPosition()} updatingPortfolio={updatingPortfolio} refreshPortfolio={this.refreshPortfolio} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions} sortColName={sorting.positions.colName} sortDirection={sorting.positions.colDirection}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, sorting: state.portfolios.sorting, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
