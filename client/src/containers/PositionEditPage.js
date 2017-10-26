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
    this.setState({     // do not reset symbolOptions.
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
        [name]: value,
      },
    });
  }

  handleOpen = () => {
    this.setState({modalOpen: true, editedPosition: Object.assign({}, this.props.position, {stock_symbol_id: this.props.position.stock_symbol.id})});
  }

  handleSubmit = () => {
    this.props.onClickSubmit(this.state.editedPosition);
    this.resetComponent();
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {modalOpen, symbolOptions, editedPosition} = this.state;
    return (
      <Modal
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header as='h3' icon='browser' content='Position Editor'/></Modal.Header>
        <Modal.Content><PositionEdit symbols={symbolOptions} position={editedPosition} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
