import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _cloneDeep from 'lodash.clonedeep';
import * as portfolioActions from '../actions/portfolioActions.js';
import PropTypes from 'prop-types';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import {PortfolioEdit} from '../components/PortfolioEdit';

// This class handles the editing of Portfolio attributes.
class PortfolioEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      editedPortfolio: {},
      modalOpen: false,
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    const {editedPortfolio} = this.state;
    let newPortfolio = _cloneDeep(editedPortfolio);
    newPortfolio[name] = value;
    this.setState({editedPortfolio: newPortfolio});
  }

  handleOpen = () => {
    const {portfolio} = this.props;
    this.setState({editedPortfolio: _cloneDeep(portfolio), modalOpen: true});
  }

  handleSubmit = () => {
    const {actions} = this.props;
    const {editedPortfolio} = this.state;
    editedPortfolio.id ? actions.portfolioUpdate(editedPortfolio) : actions.portfolioAdd(editedPortfolio);
    this.resetComponent();
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {editedPortfolio, modalOpen} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} id='portfolioEdit' link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Portfolio Editor' icon='edit' size='small'/></Modal.Header>
        <Modal.Content><PortfolioEdit portfolio={editedPortfolio} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='portfolioEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

PortfolioEditPage.propTypes = {
  iconColor: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  portfolio: PropTypes.object.isRequired,
  tooltip: PropTypes.string.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(portfolioActions, dispatch)};
}

export default connect(undefined, mapDispatchToProps)(PortfolioEditPage);
