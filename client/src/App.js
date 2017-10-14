import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Dropdown, Image, Menu} from 'semantic-ui-react';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Menu borderless>
          <Image src='images/goldman-snacks.jpg' size='mini'/>
            <Menu.Item header as={Link} to='/'>StockAnalyzer</Menu.Item>
            <Dropdown item text='Portfolios'>
              <Dropdown.Menu>
                <Dropdown.Item>New</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item as={Link} to='/portfolios/1'>Portfolio X</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown item text='Help'>
              <Dropdown.Menu>
                <Dropdown.Item>StockAnalyzer Help</Dropdown.Item>
                <Dropdown.Item as={Link} to='/about'>About</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu>

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
