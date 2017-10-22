import React, {Component} from 'react';
import {Header, Icon, Modal} from 'semantic-ui-react';
import PortfolioEdit from '../components/PortfolioEdit';

export default class PortfolioEditPage extends Component {

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      id: '',
      name: '',
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  }

  handleOpen = () => {
    if (this.props.portfolio) {
      this.setState({id: this.props.portfolio.id, name: this.props.portfolio.name});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    const {id, name} = this.state;
    this.props.onClickSubmit({id: id, name: name});
    this.resetComponent();
  }

  render() {
    let {modalOpen, name} = this.state;
    return (
      <Modal
        trigger={<Icon name={this.props.iconName} title={this.props.tooltip} link color={this.props.iconColor} onClick={this.handleOpen}> {this.props.actionName}</Icon>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Header icon='browser' content='Portfolio Editor'/>
        <Modal.Content><PortfolioEdit name={name} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
