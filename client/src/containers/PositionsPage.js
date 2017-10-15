import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/positionActions.js';
import Positions from '../components/Positions';

class PositionsPage extends Component {

  componentDidMount() {
    if (this.props.stock_symbols.length === 0) {
      this.props.actions.fetchSymbols();
    }
  }

  removePosition = (open_position) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(open_position);
    }
  }

  submitPosition = (open_position) => {
    if (open_position.id === '') {
      this.props.actions.addPosition(open_position);
    } else {
      this.props.actions.updatePosition(open_position);
    }
  }

  render() {
    const portfolio_id = parseInt(this.props.match.params.id, 10);
    const portfolio = this.props.portfolios.find((thisPortfolio) => {
      return thisPortfolio.id === portfolio_id;
    });
    if (portfolio) {
      return (<Positions portfolio={portfolio} prices={this.props.prices} stock_symbols={this.props.stock_symbols} onClickSubmit={this.submitPosition} onClickRemove={this.removePosition}/>);
    }
    return ('Refresh Error');
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios, prices: state.prices.prices, stock_symbols: state.stock_symbols.stock_symbols};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
