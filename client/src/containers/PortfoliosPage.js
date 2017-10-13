import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {

  componentDidMount() {
    if (this.props.portfolios.length === 0) {
      this.props.actions.fetchPortfolios()
    }
  }

  updatePortfolio = (newValues) => {
    this.props.actions.updatePortfolio({
      index: newValues.index,
      id: newValues.id,
      name: newValues.name,
    });
  }

  removePortfolio = (portfolio, itemIndex) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePortfolio(portfolio, itemIndex);
    }
  }

  render() {
    return (<Portfolios portfolios={this.props.portfolios} onClickUpdate={this.updatePortfolio} onClickRemove={this.removePortfolio}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
