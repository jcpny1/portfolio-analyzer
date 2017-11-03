import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Dropdown, Grid, Image, Menu} from 'semantic-ui-react';
import HelpPage from './containers/HelpPage';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';
import SymbolsPage from './containers/SymbolsPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Grid celled divided padded>
            <Grid.Row>
              <Grid.Column stretched>
                <Image src='/images/logo.jpg'/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Menu>
                  <Menu.Item as={Link} to='/'>Portfolios</Menu.Item>
                  {<SymbolsPage/>}
                  <Menu.Menu position='right'>
                    <Menu.Item disabled>Settings</Menu.Item>
                    <Dropdown item text='Help'>
                      <Dropdown.Menu>
                        <HelpPage />
                        <Dropdown.Divider/>
                        <Dropdown.Item disabled as={Link} to='/about'>About</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Menu.Menu>
                </Menu>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Switch>
                <Route exact path="/"           component={PortfoliosPage}/>
                <Route path="/about"            component={PortfoliosPage}/>
                <Route path="/home"             component={PortfoliosPage}/>
                <Route exact path="/portfolios" component={PortfoliosPage}/>
                <Route path="/portfolios/:id"   component={PositionsPage}/>
              </Switch>
            </Grid.Row>
          </Grid>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {state: state}
}

export const WrapperApp = connect(mapStateToProps)(App)
