import React, {Component} from 'react';
import { Button, Form, Header, Icon, Modal } from 'semantic-ui-react';

const INIT_STATE = { modalOpen: false, symbol: '', quantity: '', cost: '', date_acquired: '' };

export default class PositionEdit extends Component {
  constructor(props) {
      super(props)
      this.state = INIT_STATE;
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { symbol, quantity, cost, date_acquired } = this.state;
debugger;
    this.handleClose();
  }

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState(INIT_STATE);

  render() {
    const { symbol, quantity, cost, date_acquired } = this.state;

    // <Button color='red' onClick={this.handleClose}><Icon name='cancel' /> Cancel</Button>
    // <Button color='green' onClick={this.handleSubmit}><Icon name='save' /> Save</Button>
    return (
      <Modal trigger={<Icon name='edit' link color='green' onClick={this.handleOpen}/>} open={this.state.modalOpen} onClose={this.handleClose}>
        <Header icon='browser' content='Position Editor'/>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <p>Your inbox is getting full, would you like us to enable automatic archiving of old messages?</p>
            <Form.Group>
              <Form.Input width={4} placeholder='Symbol' name='symbol' value={symbol} onChange={this.handleChange} required/>
              <Form.Input width={4} placeholder='Quantity' name='quantity' value={quantity} onChange={this.handleChange}/>
              <Form.Input width={4} placeholder='Cost' name='cost' value={cost} onChange={this.handleChange}/>
              <Form.Input width={4} placeholder='Date Acquired' name='date_acquired' value={date_acquired} onChange={this.handleChange}/>
            </Form.Group>
            <Form.Group>
              <Button color='red' onClick={this.handleClose}>Cancel</Button>
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
