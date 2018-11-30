import React, {Component} from 'react';
import {Header, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {Help} from '../components/Help';

export default class HelpPage extends Component {
  render() {
    return (
      <Modal trigger={this.props.trigger} closeIcon='close'>
        <Modal.Header><Header content='Notes' icon='info circle' size='small'/></Modal.Header>
        <Modal.Content><Help/></Modal.Content>
        <Modal.Actions></Modal.Actions>
      </Modal>
    );
  }
}

HelpPage.propTypes = {
  trigger: PropTypes.object.isRequired,
}
