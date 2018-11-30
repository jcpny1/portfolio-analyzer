import React, {Component} from 'react';
import {Button, Header, Menu, Modal} from 'semantic-ui-react';
import * as Request from '../utils/request';
import {Symbols} from '../components/Symbols';

export default class SymbolsPage extends Component {

  static DISPLAY_ROWS_MAX = 20;

  componentWillMount() {
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
          this.setState({searchResults: instruments.data.slice(0, SymbolsPage.DISPLAY_ROWS_MAX)});
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
        trigger={<Menu.Item onClick={this.handleOpen}>Symbol Lookup</Menu.Item>}
        open={modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header content='Symbol Lookup' icon='search' size='small'/></Modal.Header>
        <Modal.Content><Symbols searchValue={searchValue} serverInstruments={searchResults} onChange={this.handleChange}/></Modal.Content>
        <Modal.Actions><Button color='green' onClick={this.handleCancel}>Done</Button></Modal.Actions>
      </Modal>
    );
  }
}
