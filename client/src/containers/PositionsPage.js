import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import Positions from '../components/Positions'
import * as actions from '../actions/portfolioActions.js';

class PositionsPage extends Component {

  componentDidMount() {
    if (this.props.portfolios.length === 0) {
      this.props.actions.fetchPortfolios()
    }
  }

  render() {
    return (
      <Positions portfolios={this.props.portfolios} />
    );
  }
}

function mapStateToProps(state) {
  return {portfolios: state.users.portfolios};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
