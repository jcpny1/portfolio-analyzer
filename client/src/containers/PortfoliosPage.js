import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import Portfolios from '../components/Portfolios'
import * as actions from '../actions/portfolioActions.js';

class PortfoliosPage extends Component {

  componentDidMount() {
    if (this.props.portfolios.length === 0) {
      this.props.actions.fetchPortfolios()
    }
  }

  render() {
    return (
      <Portfolios portfolios={this.props.portfolios} />
    );
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
