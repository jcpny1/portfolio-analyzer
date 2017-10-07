import React, {Component} from 'react';
import {Form, Header, Icon, Modal} from 'semantic-ui-react';

export default class PositionEdit extends Component {
  constructor(props) {
      super(props)
      this.state = {modalOpen: false, onUpdateClick: props.onUpdateClick, symbol: props.position.stock_symbol.name, quantity: props.position.quantity, cost: props.position.cost, date_acquired: props.position.date_acquired};
      this.initialState = this.state;
  }

  handleCancel = () => {
    this.setState(this.initialState);
  }

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleOpen = () => this.setState({modalOpen: true});

  handleSubmit = () => {
    const {onUpdateClick, symbol, quantity, cost, date_acquired} = this.state;
    onUpdateClick({symbol: symbol, quantity: quantity, cost: cost, date_acquired: date_acquired});
    this.setState({modalOpen: false});
  }

  render() {
    const {symbol, quantity, cost, date_acquired} = this.state;

    return (
      <Modal trigger={<Icon name='edit' link color='green' onClick={this.handleOpen}/>} open={this.state.modalOpen} onClose={this.handleCancel}>
        <Header icon='browser' content='Position Editor'/>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <p>Update position info. Press Cancel or Submit when done.</p>
            <Form.Group>
              <Form.Input width={4} label='Symbol' placeholder='Symbol' name='symbol' value={symbol} onChange={this.handleChange} required/>
              <Form.Input width={4} label='Quantity' placeholder='Quantity' name='quantity' value={quantity} onChange={this.handleChange}/>
              <Form.Input width={4} label='Cost' placeholder='Cost' name='cost' value={cost} onChange={this.handleChange}/>
              <Form.Input width={4} label='Date Acquired' placeholder='Date Acquired' name='date_acquired' value={date_acquired} onChange={this.handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Button color='red' content='Cancel' onClick={this.handleCancel}/>
              <Form.Button color='green' content='Submit'/>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
      </Modal>
    );
  }
}
