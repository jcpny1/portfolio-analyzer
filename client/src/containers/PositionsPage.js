import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as positionActions from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';   // !! kludge for position refresh error.
import * as stockSymbolActions from '../actions/stockSymbolActions.js';
import Positions from '../components/Positions';

class PositionsPage extends Component {
  lastSortColumn = '';      // which column was last sorted.
  lastSortReverse = false;  // was the last sort a reverse sort?

  componentDidMount() {
    this.props.stockSymbols.length || this.props.actions.loadStockSymbols()
    this.props.portfolios.length   || this.props.actions.loadPortfolios() // !! kludge for refresh clearing state.
  }

  refreshPortfolio = (portfolio) => {
    this.props.actions.loadPortfolios(true, portfolio.id);
  }

  removePosition = (open_position) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(open_position);
    }
  }

  sortPositions = (columnName) => {
    let reverseSort = this.lastSortReverse;
    if (this.lastSortColumn !== columnName) {
      this.lastSortColumn = columnName;
      reverseSort = false;
    } else {
      reverseSort = !reverseSort;
    }
    const portfolio_id = parseInt(this.props.match.params.id, 10);
    this.props.actions.sortPositions(portfolio_id, columnName, reverseSort);
    this.lastSortReverse = reverseSort;
  }

  submitPosition = (open_position) => {
    (open_position.id === '') ? this.props.actions.addPosition(open_position) : this.props.actions.updatePosition(open_position);
  }

  render() {
    const portfolio_id = parseInt(this.props.match.params.id, 10);
    const portfolio = this.props.portfolios.find((thisPortfolio) => {return thisPortfolio.id === portfolio_id;});

    if (portfolio) {    // if user hit browser refresh, state gets cleared out!
      return (<Positions portfolio={portfolio} stockSymbols={this.props.stockSymbols} refreshPortfolio={this.refreshPortfolio} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions}/>);
    }
    return null;
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, stockSymbols: state.stock_symbols.stockSymbols};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...portfolioActions, ...positionActions, ...stockSymbolActions}, dispatch)};  // !! ...portfolioActions kludge for position refresh error.
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
