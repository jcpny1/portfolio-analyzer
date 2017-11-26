import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Button, Dropdown, Grid, Header, Image, Menu, Table} from 'semantic-ui-react';
import ConfirmDialog from './containers/ConfirmDialog';
import HeadlinesPage from './containers/HeadlinesPage';
import HelpPage from './containers/HelpPage';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';
import * as Request from './utils/request';
import SettingsEditPage from './containers/SettingsEditPage';
import SymbolsPage from './containers/SymbolsPage';

class App extends Component {
  menuItemAdmin() {
    return (
      <Dropdown item text='Admin'>
        <Dropdown.Menu>
          <ConfirmDialog triggerType='dropdown' title='Refresh Instruments' header='Refresh instrument inventory from data feed' onClickConfirm={Request.refreshInstruments}/>
          <ConfirmDialog triggerType='dropdown' title='Refresh Prices'  header='Reprice entire instrument inventory' onClickConfirm={Request.refreshPrices}/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  menuItemHelp() {
    return (
      <Dropdown item text='Help'>
        <Dropdown.Menu>
          <SettingsEditPage/>
          <HelpPage trigger={<Dropdown.Item>Usage Notes</Dropdown.Item>}/>
          <Dropdown.Divider/>
          <Dropdown.Item disabled as={Link} to='/about'>About</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  pageBody() {
    return (
      <Grid.Row columns={2}>
        <Grid.Column width={11} style={{paddingRight:'5px'}}>
          <Switch>
            <Route exact path="/"           component={PortfoliosPage}/>
            <Route path="/about"            component={PortfoliosPage}/>
            <Route path="/home"             component={PortfoliosPage}/>
            <Route exact path="/portfolios" component={PortfoliosPage}/>
            <Route path="/portfolios/:id"   component={PositionsPage}/>
          </Switch>
        </Grid.Column>
        <Grid.Column width={5} style={{paddingLeft:'5px'}}>
          <HeadlinesPage/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageFooter() {
    return (
      <Grid.Row columns={1}>
        <Grid.Column>
          {this.pageFooterRow()}
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageFooterRow() {
    return (
      <Table compact striped style={{marginTop:0}}>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>
              <span style={{color:'grey', textAlign:'center'}}>
                            &bull; Market data provided by <a href='https://iextrading.com' target='_blank' rel='noopener noreferrer'>IEX</a>
                &emsp;&emsp;&bull; Headline news powered by <a href='https://newsapi.org' target='_blank' rel='noopener noreferrer'>NewsAPI.org</a>
                &emsp;&emsp;&bull; The prices shown may not be the correct prices or the latest prices.
                &emsp;&emsp;&bull; See the <HelpPage trigger={<Button content='Help->Usage Notes' className='link' inverted size='medium'/>}/> page for more information.
              </span>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  }

  pageHeader() {
    return (
      <Grid.Row columns={1}>
        <Grid.Column stretched>
          <Image src='/images/logo.jpg'/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageMenu() {
    return (
      <Grid.Row columns={1}>
        <Grid.Column>
          <Menu>
            {this.pageMenuLeft()}
            {this.pageMenuCenter()}
            {this.pageMenuRight()}
          </Menu>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageMenuCenter() {
    return (
      <Header className='shadow' color='purple' size='large'>
        Portfolio Analyzer
      </Header>
    );
  }

  pageMenuLeft() {
    return (
      <Menu.Menu position='left'>
        <Menu.Item as={Link} to='/'>Portfolios</Menu.Item>
        {<SymbolsPage/>}
      </Menu.Menu>
    );
  }

  pageMenuRight() {
    return (
      <Menu.Menu position='right'>
        {this.menuItemAdmin()}
        {this.menuItemHelp()}
      </Menu.Menu>
    );
  }

  render() {
    return (
      <Router>
        <Grid padded stackable>
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
