import React, {Component} from 'react';
import {Button, Header, Menu, Modal} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import ActionUtils from '../actions/actionUtils';
import Symbols from '../components/Symbols';

export default class SymbolsPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      results: [],
      value: '',
    });
  }

  search = (query, cb) => {
    return fetch(`/api/stock_symbols/by_long_name?q=${query}`, {
      headers: {'Accept': 'application/json'},
    })
    .then(ActionUtils.checkStatus)
    .then(response => response.json())
    .then(cb);
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
    if (e.target.name === 'value') {
      if (value.length === 0) {
        this.setState({results: []});
      } else {
        this.search(value, symbols => {
        let symbolList = [];
        symbols.forEach( symbol => {
          symbolList.push({long_name: symbol.long_name, name: symbol.name});
        })
        this.setState({results: symbolList.slice(0, 10)});
        });
      }
    }
  }

  handleOpen = () => {
    this.setState({modalOpen: true});
  }

  render() {
    let {results, value} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        size='small'
        trigger={<Menu.Item onClick={this.handleOpen}>Symbol Lookup</Menu.Item>}
        open={this.state.modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header><Header content='Symbol Lookup' icon='search' size='small'/></Modal.Header>
        <Modal.Content><Symbols symbolName={value} symbols={results} onChange={this.handleChange}/></Modal.Content>
        <Modal.Actions><Button color='green' onClick={this.handleCancel}>Done</Button></Modal.Actions>
      </Modal>
    );
  }
}
