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
      editedPortfolio: {},
    });
  }

  // id: '',
  // name: '',


  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      editedPortfolio: {
        ...this.state.editedPortfolio,
        [name]: value,
      },
    });
  }

  handleOpen = () => {
    const {portfolio} = this.props;
    if (portfolio) {
      this.setState({editedPortfolio: {id: portfolio.id, name: portfolio.name}});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    this.props.onClickSubmit(this.state.editedPortfolio);
    this.resetComponent();
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {modalOpen, editedPortfolio} = this.state;
    return (
      <Modal
        trigger={<Icon name={iconName} title={tooltip} link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header as='h3' icon='browser' content='Portfolio Editor'/></Modal.Header>
        <Modal.Content><PortfolioEdit portfolio={editedPortfolio} onCancel={this.handleCancel} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
