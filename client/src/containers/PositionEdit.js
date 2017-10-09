import React, {Component} from 'react';
import {Form, Header, Icon, Modal} from 'semantic-ui-react';

export default class PositionEdit extends Component {
  constructor(props) {
      super(props)
      this.initialState = {
        onClickUpdate: this.props.onClickUpdate,
        id: '',
        portfolio_id: '',
        stock_symbol: {},
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
    if (this.props.position) {
      this.initialState = {id: this.props.position.id, portfolio_id: this.props.position.portfolio_id, stock_symbol: this.props.position.stock_symbol, quantity: this.props.position.quantity, cost: this.props.position.cost, date_acquired: this.props.position.date_acquired};
      this.setState(this.initialState);
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    // TODO get new state stock_symbol record if stock symbol name changes.
    const {onClickUpdate, id, portfolio_id, stock_symbol, quantity, cost, date_acquired} = this.state;
    onClickUpdate({id: id, portfolio_id: portfolio_id, stock_symbol: stock_symbol, quantity: quantity, cost: cost, date_acquired: date_acquired});
    this.setState({modalOpen: false});
  }

  render() {
    let {stock_symbol, quantity, cost, date_acquired} = this.state;

    const options = [
      { key: 'aab',  text: 'AAB',  value: {id:  2, name: 'aab',  trading_name: 'aab',  company_id:  1} },
      { key: 'aapl', text: 'AAPL', value: {id: 50, name: 'aapl', trading_name: 'aapl', company_id: 31} },
    ]

    return (
      <Modal trigger={<Icon name={this.props.iconName} link color={this.props.iconColor} onClick={this.handleOpen}/>} open={this.state.modalOpen} onClose={this.handleCancel}>
        <Header icon='browser' content='Position Editor'/>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <p>Update position info. Press Cancel or Submit when done.</p>
            <Form.Group>
              <Form.Select options={options} width={4} label='Symbol' placeholder='Symbol' name='stock_symbol' value={stock_symbol} onChange={this.handleChange} required/>
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
