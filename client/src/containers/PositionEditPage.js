import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _cloneDeep from 'lodash.clonedeep';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Position from '../classes/Position';
import * as positionActions  from '../actions/positionActions';
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
      stringPosition: {
        symbol      : '',
        quantity    : '',
        cost        : '',
        dateAcquired: '',
      },
      formError: {},
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    const {stringPosition} = this.state;
    const newValue = (name === 'symbol') ? value.toUpperCase() : value;
    stringPosition[name] = newValue;
    this.setState({stringPosition: stringPosition});
  }

  handleOpen = () => {
    const {stringPosition} = this.state;
    const {position} = this.props;
    stringPosition['symbol']       = position.instrument.symbol;
    stringPosition['quantity']     = position.quantity;
    stringPosition['cost']         = position.cost;
    stringPosition['dateAcquired'] = position.dateAcquired.toForm();
    this.setState({
      editedPosition: _cloneDeep(position),
      modalOpen: true,
      stringPosition: stringPosition,
    });
  }

  handleSubmit = () => {
    const {actions, sortFn} = this.props;
    const {editedPosition, stringPosition} = this.state;
    Position.validateStringInput(stringPosition, error => {
      if (error) {
        this.setState({formError: error});
      } else {
        editedPosition.symbol       = stringPosition.symbol;
        editedPosition.quantity     = stringPosition.quantity;
        editedPosition.cost         = stringPosition.cost;
        editedPosition.dateAcquired = stringPosition.dateAcquired;
        editedPosition.id ? actions.positionUpdate(editedPosition, sortFn) : actions.positionAdd(editedPosition, sortFn);
        this.resetComponent();
      }
    });
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {formError, modalOpen, stringPosition} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Position Editor' icon='edit' size='small'/></Modal.Header>
        <Modal.Content><PositionEdit position={stringPosition} formError={formError} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
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
