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
    this.props.portfolios.length   || this.props.actions.loadPortfolios() // !! kludge for position refresh error.
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

    if (portfolio) {
      return (<Positions portfolio={portfolio} prices={this.props.prices} stockSymbols={this.props.stockSymbols} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition} onClickColHeader={this.sortPositions}/>);
    }
    return ('Refresh Problem!');  // !! Some kind of refresh flaw when refreshing while on Positions page.
                                  // !! A browser refresh on a positions page seems to clear out app's state.
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, prices: state.prices.prices, stockSymbols: state.stock_symbols.stockSymbols};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ ...positionActions, ...stockSymbolActions, ...portfolioActions }, dispatch)};  // !! ...portfolioActions kludge for position refresh error.
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
