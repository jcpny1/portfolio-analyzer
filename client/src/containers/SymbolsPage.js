import React, {Component} from 'react';
import {Button, Header, Menu, Modal} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as stockSymbolActions from '../actions/stockSymbolActions.js';
import Symbols from '../components/Symbols';

class SymbolsPage extends Component {
  initialState = {
      modalOpen: false,
      name: '',
  };
  state = Object.assign({}, this.initialState);

  componentDidMount() {
    this.props.stockSymbols.length || this.props.actions.loadStockSymbols()
  }

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  }

  handleCancel = () => {
    this.setState(this.initialState);
  }

  handleOpen = () => {
    this.setState({modalOpen: true});
  }

  render() {
    let {name} = this.state;
    return (
      <Modal
        trigger={<Menu.Item header onClick={this.handleOpen}>Symbol Lookup</Menu.Item>}
        open={this.state.modalOpen}>
        <Header icon='browser' content='Symbol Lookup'/>
        <Modal.Content
      >
        <Symbols name={name} stockSymbols={this.props.stockSymbols} onChange={this.handleChange}/>
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
  return {actions: bindActionCreators({...stockSymbolActions}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolsPage);
