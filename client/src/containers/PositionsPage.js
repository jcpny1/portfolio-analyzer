import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionUtils from '../actions/actionUtils';
import * as positionActions from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';   // !! !! kludge for refresh clearing state.
import * as stockSymbolActions from '../actions/stockSymbolActions.js';
import Positions from '../components/Positions';

class PositionsPage extends Component {

  newPosition = (portfolioId) => {
    return {
      portfolio_id: portfolioId,
      id: '',
      stock_symbol: {},
      quantity: '',
      cost: '',
      date_acquired: '',
    }
  };

  constructor(props) {
    super(props);
    const portfolioId = parseInt(this.props.match.params.id, 10);
    const portfolio = this.props.portfolios.find((thisPortfolio) => {return thisPortfolio.id === portfolioId;});
    this.state = {
      portfolio: portfolio,
      positionsSorter: ActionUtils.columnSorter(this.props.actions.sortPositions),
    };
  }

  componentDidMount() {
    this.props.stockSymbols.length || this.props.actions.loadStockSymbols()
    this.props.portfolios.length   || this.props.actions.loadPortfolios(false)   // !! kludge for refresh clearing state.
  }

  refreshPortfolio = (portfolio) => {
    this.props.actions.loadPortfolios(true, portfolio.id);
  }

  removePosition = (portfolioId, positionId) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(portfolioId, positionId);
    }
  }

  sortPositions = (columnName) => {
    this.state.positionsSorter(this.state.portfolio, columnName);
  }

  submitPosition = (openPosition) => {
    (openPosition.id === '') ? this.props.actions.addPosition(openPosition) : this.props.actions.updatePosition(openPosition);
  }

  render() {
    const {portfolio} = this.state;
    if (portfolio) {    // !! kludge for refresh clearing state.
      return (<Positions portfolio={portfolio} emptyPosition={this.newPosition(portfolio.id)} stockSymbols={this.props.stockSymbols} refreshPortfolio={this.refreshPortfolio} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions}/>);
    }
    return null;
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, stockSymbols: state.stock_symbols.stockSymbols};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions, ...stockSymbolActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
