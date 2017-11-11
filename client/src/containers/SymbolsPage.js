import React, {Component} from 'react';
import {Button, Header, Menu, Modal} from 'semantic-ui-react';
import * as ActionUtils from '../utils/actions';
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

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
    if (e.target.name === 'value') {
      if (value.length === 0) {
        this.setState({results: []});
      } else {
        ActionUtils.symbolSearch({value: value, exact:false}, symbols => {
        let symbolList = [];
        symbols.forEach(symbol => {
          symbolList.push({long_name: symbol.long_name, name: symbol.name});
        })
        this.setState({results: symbolList.slice(0, 20)});
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
        closeIcon
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
