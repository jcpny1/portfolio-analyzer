import React, {Component} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import PositionEdit from '../components/PositionEdit';

export default class PositionEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({     // Do not reset symbolOptions. Keep it cached.
      modalOpen: false,
      editedPosition: {},
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
    let stock_symbol_name = '';   // We need a stock_symbol_name property to interact with the modal form field for symbol name.
    if ('name' in this.props.position.stock_symbol) {
      stock_symbol_name = this.props.position.stock_symbol.name;
    }
    this.setState({modalOpen: true, editedPosition: Object.assign({}, this.props.position, {stock_symbol_name: stock_symbol_name})});
  }

  handleSubmit = () => {
    this.props.onClickSubmit(this.state.editedPosition);
    this.resetComponent();
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {modalOpen, editedPosition} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header as='h3' icon='browser' content='Position Editor'/></Modal.Header>
        <Modal.Content><PositionEdit position={editedPosition} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='positionEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
