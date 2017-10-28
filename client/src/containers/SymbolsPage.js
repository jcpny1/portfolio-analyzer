import React, {Component} from 'react';
import {Button, Header, Menu, Modal} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import Symbols from '../components/Symbols';

export default class SymbolsPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      value: '',
      results: [],
    });
  }

  search = (query, cb) => {
    return fetch(`/api/companies?q=${query}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(response => response)
    .then(response => response.json())
    .then(cb);
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value.toUpperCase()});
    if ((e.target.name === 'value') && (value.length > 0)) {
      this.search(value, companies => {
        let symbolList = [];
        companies.forEach( company => {
          company.stock_symbols.forEach( stock_symbol => {
            symbolList.push({name: company.name, stockSymbolName: stock_symbol.name});
          })
        });
        this.setState({results: symbolList.slice(0, 10)});
      });
    }
  }

  handleOpen = () => {
    this.setState({modalOpen: true});
  }

  render() {
    let {results, value} = this.state;
    return (
      <Modal
        size='small'
        trigger={<Menu.Item onClick={this.handleOpen}>Symbol Lookup</Menu.Item>}
        open={this.state.modalOpen}
        onClose={this.handleCancel}
      >
        <Modal.Header>
          <Header as='h3' icon='browser' content='Symbol Lookup'/>
        </Modal.Header>
        <Modal.Content>
          <Symbols companyName={value} companies={results} onChange={this.handleChange}/>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleCancel}>Done</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
