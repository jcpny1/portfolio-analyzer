import React, {Component} from 'react';
import {Button, Dropdown, Header, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import * as Request from '../utils/request';
import {SettingsEdit} from '../components/SettingsEdit';

export default class SettingsEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      editedSettings: {},
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      editedSettings: {
        ...this.state.editedSettings,
        [name]: value,
      },
    });
  }

  handleOpen = () => {
    const {userId} = this.props;
    Request.userFetch(userId, user => {
      this.setState({editedSettings: {...user}, modalOpen: true});
    });
  }
  handleSubmit = () => {
    Request.userSave(this.state.editedSettings);
    this.resetComponent();
  }

  render() {
    const {editedSettings, modalOpen} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Dropdown.Item onClick={this.handleOpen}>Settings</Dropdown.Item>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Settings Editor' icon='settings' size='small'/></Modal.Header>
        <Modal.Content><SettingsEdit settings={editedSettings} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='settingsEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

SettingsEditPage.propTypes = {
  userId: PropTypes.number.isRequired,
}
