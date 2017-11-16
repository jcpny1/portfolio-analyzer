import React, {Component} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Position from './classes/Position';
import {PositionEdit} from '../components/PositionEdit';

export default class PositionEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({     // Do not reset symbolOptions. Keep it cached.
      modalOpen: false,
      editedPosition: {},
      formError: {},
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      editedPosition: {
          ...this.state.editedPosition,
          [name]: (name === 'instrument_symbol') ? value.toUpperCase() : value,
      },
    });
  }

  handleOpen = () => {
    const {position} = this.props;
    let instrument_symbol = '';   // We need an instrument_symbol property to interact with the instrument_symbol modal form field.
    if ('symbol' in position.instrument) {
      instrument_symbol = position.instrument.symbol;
    }
    this.setState({modalOpen: true, editedPosition: Object.assign({}, position, {instrument_symbol: instrument_symbol})});
  }

  handleSubmit = () => {
    Position.validate(this.state.editedPosition, error => {
      if (error !== null) {
        this.setState({formError: error});
      } else {
        this.props.onClickSubmit(this.state.editedPosition);
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
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='positionEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

PositionEditPage.propTypes = {
  iconColor: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  onClickSubmit: PropTypes.func.isRequired,
  position: PropTypes.object.isRequired,
  tooltip: PropTypes.string.isRequired,
}
