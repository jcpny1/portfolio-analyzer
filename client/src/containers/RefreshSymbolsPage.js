import React, {Component} from 'react';
import {Button, Dropdown, Header, Modal} from 'semantic-ui-react';
import ActionUtils from '../actions/actionUtils';
import RefreshSymbols from '../components/RefreshSymbols';

export default class RefreshSymbolsPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleOpen = () => {
    this.setState({modalOpen: true});
  }

  handleRefresh = () => {
    ActionUtils.refreshSymbols();
    this.resetComponent();
  }

  render() {
    const {modalOpen} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Dropdown.Item onClick={this.handleOpen}>Refresh Symbols</Dropdown.Item>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header as='h3' icon='download' content='Refresh Symbols'/></Modal.Header>
        <Modal.Content><RefreshSymbols/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' onClick={this.handleRefresh}>Refresh</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
