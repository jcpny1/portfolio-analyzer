import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/portfolioActions.js';
import Portfolios from '../components/Portfolios';

class PortfoliosPage extends Component {
  constructor(props) {
      super(props)
      this.lastSortColumn = '';      // which column was last sorted.
      this.lastSortReverse = false;  // was the last sort a reverse sort?
  }

  componentDidMount() {
    this.props.portfolios.length || this.props.actions.loadPortfolios()
  }

  removePortfolio = (portfolio) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePortfolio(portfolio);
    }
  }

  sortPortfolios = (columnName) => {
    let reverseSort = this.lastSortReverse;
    if (this.lastSortColumn !== columnName) {
      this.lastSortColumn = columnName;
      reverseSort = false;
    } else {
      reverseSort = !reverseSort;
    }
    this.props.actions.sortPortfolios(columnName, reverseSort);
    this.lastSortReverse = reverseSort;
  }

  submitPortfolio = (portfolio) => {
    portfolio.id === '' ? this.props.actions.addPortfolio(portfolio) : this.props.actions.updatePortfolio(portfolio);
  }

  render() {
    return (<Portfolios portfolios={this.props.portfolios} onClickSubmit={this.submitPortfolio} onClickRemove={this.removePortfolio} onClickColHeader={this.sortPortfolios}/>);
  }
}

function mapStateToProps(state) {
  return {portfolios: state.portfolios.portfolios};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
