import React, {Component} from 'react';
import {Dropdown, Header, Modal} from 'semantic-ui-react';
import Help from '../components/Help';

export default class HelpPage extends Component {
  render() {
    return (
      <Modal trigger={<Dropdown.Item>Usage Notes</Dropdown.Item>} closeIcon='close'>
        <Modal.Header><Header as='h2' icon='info circle' content='Notes'/></Modal.Header>
        <Modal.Content><Help/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}
