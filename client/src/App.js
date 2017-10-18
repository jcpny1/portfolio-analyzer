import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Dropdown, Grid, Image, Menu} from 'semantic-ui-react';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Grid columns={1} style={{'marginLeft': '1rem'}}>
            <Grid.Row>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={14}>
                <Image src='/images/logo.jpg'/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={14}>
                <Menu borderless>
                  <Menu.Item header as={Link} to='/'>Portfolios</Menu.Item>
                  <Menu.Item header as={Link} to='/'>Symbol Lookup</Menu.Item>
                  <Dropdown item text='Help'>
                    <Dropdown.Menu>
                      <Dropdown.Item>StockAnalyzer Help</Dropdown.Item>
                      <Dropdown.Divider/>
                      <Dropdown.Item as={Link} to='/about'>About</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Route exact path="/"           component={PortfoliosPage}/>
          <Route path="/about"            component={PortfoliosPage}/>
          <Route path="/home"             component={PortfoliosPage}/>
          <Route path="/portfolios/:id"   component={PositionsPage}/>
          <Route exact path="/portfolios" component={PortfoliosPage}/>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {state: state}
}

export const WrapperApp = connect(mapStateToProps)(App)
