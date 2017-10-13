import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/positionActions.js';
import Positions from '../components/Positions';

class PositionsPage extends Component {

  componentDidMount() {
    const pathParts = this.props.location.pathname.split('/');
    const portfolio_id = pathParts[pathParts.length-1];
    this.props.actions.fetchPositions(portfolio_id);
    if (this.props.stock_symbols.length === 0) {
      this.props.actions.fetchSymbols();
    }
  }

  updatePosition = (newValues) => {
    this.props.actions.updatePosition({
      index: newValues.index,
      id: newValues.id,
      portfolio_id: newValues.portfolio_id,
      stock_symbol_id: newValues.stock_symbol_id,
      quantity: newValues.quantity,
      cost: newValues.cost,
      date_acquired: newValues.date_acquired,
    });
  }

  removePosition = (open_position, itemIndex) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(open_position, itemIndex);
    }
  }

  render() {
    return (<Positions portfolio_id={this.props.portfolio_id} positions={this.props.positions} prices={this.props.prices} stock_symbols={this.props.stock_symbols} onClickUpdate={this.updatePosition} onClickRemove={this.removePosition}/>);
  }
}

function mapStateToProps(state) {
  return {portfolio_id: state.positions.portfolio_id, positions: state.positions.positions, prices: state.prices.prices, stock_symbols: state.stock_symbols.stock_symbols};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
