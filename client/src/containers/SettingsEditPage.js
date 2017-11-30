import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button, Dropdown, Header, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {SettingsEdit} from '../components/SettingsEdit';
import * as userActions from '../actions/userActions.js';

class SettingsEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
    this.props.actions.userLoad();
  }

  resetComponent = () => {
    this.setState({
      editedUser: {},
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      editedUser: {
        ...this.state.editedUser,
        [name]: value,
      },
    });
  }

  handleOpen = () => {
    const {user} = this.props;
    if (user) {
      this.setState({editedUser: {...user}});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    this.props.actions.userUpdate(this.state.editedUser);
    this.resetComponent();
  }

  render() {
    const {editedUser, modalOpen} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Dropdown.Item onClick={this.handleOpen}>Settings</Dropdown.Item>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Settings Editor' icon='settings' size='small'/></Modal.Header>
        <Modal.Content><SettingsEdit user={editedUser} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='settingsEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

SettingsEditPage.propTypes = {
  user: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {user: state.users.user, updatingUser: state.users.updatingUser};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(userActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditPage);
