import React, {Component} from 'react';
import {Form, Header, Icon, Modal} from 'semantic-ui-react';

export default class PortfolioEditPage extends Component {
  constructor(props) {
      super(props)
      this.initialState = {
        onClickUpdate: this.props.onClickUpdate,
        id: '',
        name: '',
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
    if (this.props.portfolio) {
      this.initialState = {id: this.props.portfolio.id, name: this.props.portfolio.name};
      this.setState(this.initialState);
    }

    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    const {onClickUpdate, id, name} = this.state;
    onClickUpdate({index: this.props.index, id: id, name: name});
    this.setState({modalOpen: false});
  }

  render() {
    let {name} = this.state;

    return (
      <Modal trigger={<Icon name={this.props.iconName} title={this.props.iconName + ' a position'} link color={this.props.iconColor} onClick={this.handleOpen}/>} open={this.state.modalOpen} onClose={this.handleCancel}>
        <Header icon='browser' content='Portfolio Editor'/>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <p>Update portfolio info. Press Cancel or Submit when done.</p>
            <Form.Group>
              <Form.Input width={4} label='Name' placeholder='Name' name='name' value={name} onChange={this.handleChange} required/>
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
