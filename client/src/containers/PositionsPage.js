import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import Positions from '../components/Positions'
import * as actions from '../actions/positionActions.js';

class PositionsPage extends Component {

  componentDidMount() {
    if (this.props.positions.length === 0) {
      this.props.actions.fetchPositions()
    }
  }

  render() {
    return (<Positions positions={this.props.positions}/>);
  }
}

function mapStateToProps(state) {
  return {positions: state.positions.positions};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
