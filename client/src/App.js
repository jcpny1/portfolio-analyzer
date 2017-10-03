import React, { Component } from 'react';
import {connect} from 'react-redux';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';

export class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Menu>
            <Menu.Item as={Link} to='/'>StockAnalyzer</Menu.Item>

            <Dropdown item text='Portfolios'>
              <Dropdown.Menu>
                <Dropdown.Item>New</Dropdown.Item>
                <Dropdown.Item as={Link} to='/positions'>Portfolio X</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown item text='Help'>
              <Dropdown.Menu>
                <Dropdown.Item>StockAnalyzer Help</Dropdown.Item>
                <Dropdown.Item as={Link} to='/about'>About</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu>

          <Route exact path="/" component={PortfoliosPage} />
          <Route path="/positions" component={PositionsPage} />
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {users: state.users}
}

export const WrapperApp = connect(mapStateToProps)(App)
