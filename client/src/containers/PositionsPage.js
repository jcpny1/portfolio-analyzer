import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/positionActions.js';
import Positions from '../components/Positions';

class PositionsPage extends Component {

  componentDidMount() {
    if (!("open_positions" in this.props.positions)) {
      const pathParts = this.props.location.pathname.split('/');
      const portfolio_id = pathParts[pathParts.length-1];
      this.props.actions.fetchPositions(portfolio_id);
    }
  }

  addPosition = () => {
    this.props.actions.addPosition({
      portfolio_id: 1,
      stock_symbol_id: 1,
      quantity: 321,
      cost: 123,
      date_acquired: 20171005,
    });
  }

  removePosition = (itemIndex) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(itemIndex);
    }
  }

  render() {
    return (<Positions positions={this.props.positions} prices={this.props.prices} onAddClick={this.addPosition} onRemoveClick={this.removePosition}/>);
  }
}

function mapStateToProps(state) {
  return {positions: state.positions.positions, prices: state.prices.prices};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
