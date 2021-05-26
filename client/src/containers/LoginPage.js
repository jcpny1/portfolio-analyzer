import React, {Component} from 'react';
import {Header, Menu, Modal} from 'semantic-ui-react';
import * as Request from '../utils/request';
import {Login} from '../components/Login';

export default class LoginPage extends Component {

  static DISPLAY_ROWS_MAX = 20;

  UNSAFE_componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      searchResults: [],
      searchValue: '',
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
    if (e.target.name === 'searchValue') {
      if (value.length === 0) {
        this.setState({searchResults: []});
      } else {
        Request.instrumentSearch({value: value, exact:false}, instruments => {
          this.setState({searchResults: instruments.data.slice(0, LoginPage.DISPLAY_ROWS_MAX)});
        });
      }
    }
  }

  handleOpen = () => {
    this.setState({modalOpen: true});
  }

  render() {
    const {modalOpen, searchResults, searchValue} = this.state;
    return (
      <Modal
        closeIcon
        closeOnDimmerClick={false}
        size='small'
        trigger={<Menu.Item onClick={this.handleOpen}>Login</Menu.Item>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header content='Sign In' icon='search' size='small'/></Modal.Header>
        <Modal.Content><Login searchValue={searchValue} serverInstruments={searchResults} onChange={this.handleChange}/></Modal.Content>
      </Modal>
    );
  }
}
