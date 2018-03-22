import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _cloneDeep from 'lodash.clonedeep';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Instrument from '../classes/Instrument';
import Position from '../classes/Position';
import * as positionActions  from '../actions/positionActions.js';
import {PositionEdit} from '../components/PositionEdit';

// This class handles the editing of a Position.
// Note: This component is injecting instrument_symbol into the object instance.
//       This is because we don't have an instrument to work with at this point; Just a symbol.
//       We will convert this symbol to an instrument at the server.

// TODO: add real instrument in validation?

class PositionEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      editedPosition: {},
      formError: {},
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    const {editedPosition} = this.state;
    const newPosition = _cloneDeep(editedPosition);
    const newValue = (name === 'instrument') ? new Instrument('', value.toUpperCase(), '') : value;
    newPosition[name] = newValue;
    this.setState({editedPosition: newPosition});
  }

  handleOpen = () => {
    const {position} = this.props;
    this.setState({editedPosition: _cloneDeep(position), modalOpen: true});
  }

  handleSubmit = () => {
    const {actions, sortFn} = this.props;
    const {editedPosition} = this.state;
    Position.validateStringInput(editedPosition, error => {
      if (error) {
        this.setState({formError: error});
      } else {
        editedPosition.id ? actions.positionUpdate(editedPosition, sortFn) : actions.positionAdd(editedPosition, sortFn);
        this.resetComponent();
      }
    });
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {editedPosition, formError, modalOpen} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Position Editor' icon='edit' size='small'/></Modal.Header>
        <Modal.Content><PositionEdit position={editedPosition} formError={formError} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left' color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='positionEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

PositionEditPage.propTypes = {
  iconColor: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  position: PropTypes.object.isRequired,
  tooltip: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {sortFn: state.portfolios.sortFn};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(positionActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionEditPage);
