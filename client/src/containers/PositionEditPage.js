import React, {Component} from 'react';
import {Header, Icon, Modal} from 'semantic-ui-react';
import PositionEdit from '../components/PositionEdit';

export default class PositionEditPage extends Component {

  componentWillMount() {
    this.resetComponent();
  }

  componentDidMount() {
    if (!('symbolOptions' in this.state)) {
      this.setState({symbolOptions: this.props.stockSymbols.map( symbol => {return {key: symbol.name, text: symbol.name, value: symbol.id};})});
    }
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      id: '',
      portfolio_id: '',
      stock_symbol_id: '',
      quantity: '',
      cost: '',
      date_acquired: '',
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  }

  handleOpen = () => {
    const {position} = this.props;
    if (position) {
      this.setState({id: position.id, portfolio_id: position.portfolio_id, stock_symbol_id: position.stock_symbol.id, quantity: position.quantity, cost: position.cost, date_acquired: position.date_acquired});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    const {id, portfolio_id, stock_symbol_id, quantity, cost, date_acquired} = this.state;
    const {position, stockSymbols} = this.props;
    const stock_symbol = stockSymbols.find(stockSymbol => {return stockSymbol.id === stock_symbol_id});
    const newPosition = Object.assign({}, position, {id, portfolio_id, stock_symbol, quantity, cost, date_acquired});
    this.props.onClickSubmit(newPosition);
    this.resetComponent();
  }

  render() {
    const {modalOpen, symbolOptions, stock_symbol_id, quantity, cost, date_acquired} = this.state;
    const {iconColor, iconName, tooltip} = this.props;
    return (
      <Modal
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header as='h3' icon='browser' content='Position Editor'/></Modal.Header>
        <Modal.Content><PositionEdit symbols={symbolOptions} stock_symbol_id={stock_symbol_id} quantity={quantity} cost={cost} date_acquired={date_acquired} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
