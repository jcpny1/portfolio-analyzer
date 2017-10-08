import React, {Component} from 'react';
import {Form, Header, Icon, Modal} from 'semantic-ui-react';

export default class PositionEdit extends Component {
  constructor(props) {
      super(props)
      this.initialState = {
        onUpdateClick: this.props.onUpdateClick,
        id: '',
        portfolio_id: '',
        stock_symbol: {},
        stock_symbol_name: '',
        quantity: '',
        cost: '',
        date_acquired: '',
      };
      this.state = this.initialState;
  }

  handleCancel = () => {
    this.setState(this.initialState);
    this.setState({modalOpen: false});
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  }

  handleOpen = () => {
    // this.setState(this.initialState);
    this.initialState = {id: this.props.position.id, portfolio_id: this.props.position.portfolio_id, stock_symbol: this.props.position.stock_symbol, stock_symbol_name: this.props.position.stock_symbol.name, quantity: this.props.position.quantity, cost: this.props.position.cost, date_acquired: this.props.position.date_acquired};
    this.setState(this.initialState);
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    // TODO get new state stock_symbol record if stock symbol name changes.
    const {onUpdateClick, id, portfolio_id, stock_symbol, quantity, cost, date_acquired} = this.state;
    stock_symbol.name = this.state.stock_symbol_name;
    onUpdateClick({id: id, portfolio_id: portfolio_id, stock_symbol: stock_symbol, quantity: quantity, cost: cost, date_acquired: date_acquired});
    this.setState({modalOpen: false});
  }

  render() {
    let {stock_symbol_name, quantity, cost, date_acquired} = this.state;

    return (
      <Modal trigger={<Icon name='edit' link color='green' onClick={this.handleOpen}/>} open={this.state.modalOpen} onClose={this.handleCancel}>
        <Header icon='browser' content='Position Editor'/>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <p>Update position info. Press Cancel or Submit when done.</p>
            <Form.Group>
              <Form.Input readOnly error width={4} label='Symbol' placeholder='Symbol' name='stock_symbol_name' value={stock_symbol_name} onChange={this.handleChange} required/>
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
