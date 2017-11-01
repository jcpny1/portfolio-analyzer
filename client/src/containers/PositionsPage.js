import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionUtils from '../actions/actionUtils';
import * as positionActions from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';
import Positions from '../components/Positions';
import PortfoliosPage from './PortfoliosPage';

class PositionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolioId: parseInt(this.props.match.params.id, 10),
      sortColName  : 'name',
      sortDirection: 'ascending',
      sortFn: ActionUtils.columnSorter(this.props.actions.sortPositions),
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
    const sortDirection = this.state.sortFn(portfolio, columnName);
    this.setState({sortColName: columnName, sortDirection: sortDirection});
  }

  submitPosition = (position) => {
    (position.id === '') ? this.props.actions.addPosition(position) : this.props.actions.updatePosition(position);
  }

  render() {
    const {portfolios, stockSymbols, updatingPortfolio} = this.props;
    let portfolio = portfolios.find((portfolio) => {return portfolio.id === this.state.portfolioId});
    if (!portfolio) {  // may be null until props.portfolios is loaded.
      portfolio = PortfoliosPage.newPortfolio;
    }
    return (<Positions portfolio={portfolio} emptyPosition={this.newPosition()} stockSymbols={stockSymbols} updatingPortfolio={updatingPortfolio} refreshPortfolio={this.refreshPortfolio} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions} sortColName={this.state.sortColName} sortDirection={this.state.sortDirection}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, updatingPortfolio: state.portfolios.updatingPortfolio};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
