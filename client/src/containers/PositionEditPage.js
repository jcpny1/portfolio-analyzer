import React, {Component} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Position from '../classes/Position';
import {PositionEdit} from '../components/PositionEdit';

// This class handles the editing of a Position.
// Note: the Position object is converted to an array of strings for
// the purposes of form editing. The edited result is then converted
// back to a Position object for subsequent processing.
export default class PositionEditPage extends Component {
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
    this.setState({
      editedPosition: {
          ...this.state.editedPosition,
          [name]: (name === 'instrument_symbol') ? value.toUpperCase() : value,
      },
    });
  }

  handleOpen = () => {
    const {position} = this.props;
    this.setState({
      editedPosition: {
        quantity:          position.quantity.value,
        instrument_symbol: position.instrument.symbol,
        cost:              position.cost.value,
        date_acquired:     position.date_acquired.value
      },
      modalOpen: true,
    });
  }

  handleSubmit = () => {
    const {position} = this.props;
    const {editedPosition} = this.state;
    Position.validateStringInput(editedPosition, error => {
      if (error) {
        this.setState({formError: error});
      } else {
        const instrument = {id: '', symbol: editedPosition.instrument_symbol, name: ''};
        this.props.onClickSubmit(new Position(position.portfolio_id, position.id, instrument, editedPosition.quantity, editedPosition.cost, editedPosition.date_acquired));
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
