import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios'

class PortfoliosPage extends Component {

  componentDidMount() {
    if (this.props.portfolios.length === 0) {
      this.props.actions.fetchPortfolios()
    }
  }

  render() {
    return (
      <Portfolios portfolios={this.props.portfolios}/>
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
