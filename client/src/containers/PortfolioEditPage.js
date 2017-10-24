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
    const {portfolio} = this.props;
    if (portfolio) {
      this.setState({id: portfolio.id, name: portfolio.name});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    const {id, name} = this.state;
    const portfolio = Object.assign({}, this.props.portfolio, {id, name});
    this.props.onClickSubmit(portfolio);
    this.resetComponent();
  }

  render() {
    const {modalOpen, name} = this.state;
    const {iconColor, iconName, tooltip} = this.props;
    return (
      <Modal
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header as='h3' icon='browser' content='Portfolio Editor'/></Modal.Header>
        <Modal.Content><PortfolioEdit name={name} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
