import React, {Component} from 'react';
import {Button, Header, Menu, Modal} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as stockSymbolActions from '../actions/stockSymbolActions.js';
import Symbols from '../components/Symbols';

class SymbolsPage extends Component {

  componentWillMount() {
    this.resetComponent();
  }

  componentDidMount() {
    this.props.stockSymbols.length || this.props.actions.loadStockSymbols()
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      value: '',
      results: [],
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value.toUpperCase()});
    if ((e.target.name === 'value') && (value.length > 0)) {
      const symbolList = this.props.stockSymbols.filter(stockSymbol => stockSymbol.company.name.includes(value.toUpperCase()));
      symbolList.sort(function(s1,s2) {
        return (s1.company.name < s2.company.name) ? -1 : ((s1.company.name > s2.company.name) ? 1 : 0);
      });
      this.setState({results: symbolList.slice(0,10)});
    } else {
      this.setState({results: []});
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
          <Symbols companyName={value} stockSymbols={results} onChange={this.handleChange}/>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleCancel}>Done</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {stockSymbols: state.stock_symbols.stockSymbols};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(stockSymbolActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolsPage);
