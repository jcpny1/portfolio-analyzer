import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Dropdown, Grid, Image, Menu, Table} from 'semantic-ui-react';
import * as ActionUtils from './actions/actionUtils';
import ConfirmDialog from './containers/ConfirmDialog';
import HeadlinesPage from './containers/HeadlinesPage';
import HelpPage from './containers/HelpPage';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';
import SymbolsPage from './containers/SymbolsPage';

class App extends Component {
  infoRow() {
    return (
      <Table celled compact striped style={{marginTop:0}}>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>
              <span style={{color:'grey', textAlign:'center'}}>
                            &bull; Market data provided by <a href='https://iextrading.com' target='_blank' rel='noopener noreferrer'>IEX</a>
                &emsp;&emsp;&bull; Headline news powered by <a href='https://newsapi.org' target='_blank' rel='noopener noreferrer'>NewsAPI.org</a>
                &emsp;&emsp;&bull; The prices shown may not be the correct prices or the latest prices.
                &emsp;&emsp;&bull; See the Help Usage Notes page for more information.
              </span>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  }

  menuItemHelp() {
    return (
      <Dropdown item text='Help'>
        <Dropdown.Menu>
          <HelpPage/>
          <Dropdown.Divider/>
          <Dropdown.Item disabled as={Link} to='/about'>About</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  menuItemSettings() {
    return (
      <Dropdown item text='Settings'>
        <Dropdown.Menu>
          <Dropdown item text='Admin'>
            <Dropdown.Menu>
              <ConfirmDialog triggerType='dropdown' title='Refresh Symbols' header='Refresh symbol inventory from data feed' onClickConfirm={ActionUtils.refreshSymbols}/>
              <ConfirmDialog triggerType='dropdown' title='Refresh Prices'  header='Reprice every symbol from the data feed' onClickConfirm={ActionUtils.refreshPrices}/>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown.Item disabled text='Locale'/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  menuLeft() {
    return (
      <Menu.Menu position='left'>
        <Menu.Item as={Link} to='/'>Portfolios</Menu.Item>
        {<SymbolsPage/>}
      </Menu.Menu>
    );
  }

  menuRight() {
    return (
      <Menu.Menu position='right'>
        {this.menuItemSettings()}
        {this.menuItemHelp()}
      </Menu.Menu>
    );
  }

  pageBody() {
    return (
      <Grid.Row>
        <Grid.Column width={11}>
          <Switch>
            <Route exact path="/"           component={PortfoliosPage}/>
            <Route path="/about"            component={PortfoliosPage}/>
            <Route path="/home"             component={PortfoliosPage}/>
            <Route exact path="/portfolios" component={PortfoliosPage}/>
            <Route path="/portfolios/:id"   component={PositionsPage}/>
          </Switch>
        </Grid.Column>
        <Grid.Column width={5}>
          <HeadlinesPage/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageFooter() {
    return (
      <Grid.Row>
        <Grid.Column>
          {this.infoRow()}
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageHeader() {
    return (
      <Grid.Row>
        <Grid.Column stretched>
          <Image src='/images/logo.jpg'/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageMenu() {
    return (
      <Grid.Row>
        <Grid.Column>
          <Menu>
            {this.menuLeft()}
            {this.menuRight()}
          </Menu>
        </Grid.Column>
      </Grid.Row>
    );
  }

  render() {
    return (
      <Router>
        <Grid celled divided padded>
          {this.pageHeader()}
          {this.pageMenu()}
          {this.pageBody()}
          {this.pageFooter()}
        </Grid>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {state: state}
}

export const WrapperApp = connect(mapStateToProps)(App)
