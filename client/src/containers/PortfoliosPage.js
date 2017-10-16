import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {

  componentDidMount() {
    if (this.props.portfolios.length === 0) {
      this.props.actions.loadPortfolios()
    }
  }

  removePortfolio = (portfolio) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePortfolio(portfolio);
    }
  }

  submitPortfolio = (portfolio) => {
    portfolio.id === '' ? this.props.actions.addPortfolio(portfolio) : this.props.actions.updatePortfolio(portfolio);
  }

  render() {
    return (<Portfolios portfolios={this.props.portfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
