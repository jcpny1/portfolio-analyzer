import React, {Component} from 'react';
import {Header, Icon, Modal} from 'semantic-ui-react';
import PositionEdit from '../components/PositionEdit';

export default class PositionEditPage extends Component {
  constructor(props) {
      super(props)
      this.initialState = {
        onClickSubmit: this.props.onClickSubmit,
        id: '',
        portfolio_id: '',
        stock_symbol_id: '',
        quantity: '',
        cost: '',
        date_acquired: '',
      };
      this.symbolOptions = [];
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
      this.initialState = {id: this.props.position.id, portfolio_id: this.props.position.portfolio_id, stock_symbol_id: this.props.position.stock_symbol.id, quantity: this.props.position.quantity, cost: this.props.position.cost, date_acquired: this.props.position.date_acquired};
      this.setState(this.initialState);
    }
    if (this.symbolOptions.length === 0) {
      this.symbolOptions = this.props.stock_symbols.map( symbol => {return {key: symbol.name, text: symbol.name, value: symbol.id};});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    const {onClickSubmit, id, portfolio_id, stock_symbol_id, quantity, cost, date_acquired} = this.state;
    onClickSubmit({id: id, portfolio_id: portfolio_id, stock_symbol_id: stock_symbol_id, quantity: quantity, cost: cost, date_acquired: date_acquired});
    this.setState({modalOpen: false});
  }

  render() {
    let {stock_symbol_id, quantity, cost, date_acquired} = this.state;
    return (
      <Modal trigger={<Icon name={this.props.iconName} title={this.props.iconName + ' a position'} link color={this.props.iconColor} onClick={this.handleOpen}/>} open={this.state.modalOpen} onClose={this.handleCancel}>
        <Header icon='browser' content='Position Editor'/>
        <Modal.Content><PositionEdit symbols={this.symbolOptions} stock_symbol_id={stock_symbol_id} quantity={quantity} cost={cost} date_acquired={date_acquired} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
