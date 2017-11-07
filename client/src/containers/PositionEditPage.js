import React, {Component} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import Position from './classes/Position';
import PositionEdit from '../components/PositionEdit';

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
          [name]: (name === 'stock_symbol_name') ? value.toUpperCase() : value,
      },
    });
  }

  handleOpen = () => {
    let stock_symbol_name = '';   // We need a stock_symbol_name property to interact with the symbol name modal form field.
    if ('name' in this.props.position.stock_symbol) {
      stock_symbol_name = this.props.position.stock_symbol.name;
    }
    this.setState({modalOpen: true, editedPosition: Object.assign({}, this.props.position, {stock_symbol_name: stock_symbol_name})});
  }

  handleSubmit = () => {
    Position.validate(this.state.editedPosition, formError => {
      if (formError !== null) {
        this.setState({formError: formError});
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
