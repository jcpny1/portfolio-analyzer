import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as positionActions from '../actions/positionActions.js';
import * as portfolioActions from '../actions/portfolioActions.js';
import Headlines from '../components/Headlines';

export default class HeadlinesPage extends Component {
  componentDidMount() {
  }

  refreshHeadlines = () => {
  }

  render() {
    return (<Headlines/>);
  }
}
