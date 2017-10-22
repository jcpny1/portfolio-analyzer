import React, {Component} from 'react';
import {Header, Icon, Modal} from 'semantic-ui-react';
import PositionEdit from '../components/PositionEdit';

export default class PositionEditPage extends Component {

  componentWillMount() {
    this.resetComponent();
  }

  componentDidMount() {
    if (this.state.symbolOptions.length === 0) {
      this.setState({symbolOptions: this.props.stock_symbols.map( symbol => {return {key: symbol.name, text: symbol.name, value: symbol.id};})});
    }
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      symbolOptions: [],
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
    if (this.props.position) {
      this.setState({id: this.props.position.id, portfolio_id: this.props.position.portfolio_id, stock_symbol_id: this.props.position.stock_symbol.id, quantity: this.props.position.quantity, cost: this.props.position.cost, date_acquired: this.props.position.date_acquired});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    const {id, portfolio_id, stock_symbol_id, quantity, cost, date_acquired} = this.state;
    this.props.onClickSubmit({id: id, portfolio_id: portfolio_id, stock_symbol_id: stock_symbol_id, quantity: quantity, cost: cost, date_acquired: date_acquired});
    this.resetComponent();
  }

  render() {
    let {modalOpen, symbolOptions, stock_symbol_id, quantity, cost, date_acquired} = this.state;
    let {actionName, iconColor, iconName, tooltip} = this.props;
    return (
      <Modal
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}> {actionName}</Icon>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header>
          <Header as='h3' icon='browser' content='Position Editor'/>
        </Modal.Header>
        <Modal.Content><PositionEdit symbols={symbolOptions} stock_symbol_id={stock_symbol_id} quantity={quantity} cost={cost} date_acquired={date_acquired} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
