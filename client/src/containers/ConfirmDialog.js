import React, {Component} from 'react'
import {Confirm, Icon} from 'semantic-ui-react'

export default class ConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleCancel = () => {
    this.setState({ open: false });
  }

  handleConfirm = () => {
    this.setState({open: false});
    this.props.onClickRemove();
  }

  show = () => {
    this.setState({ open: true });
  }

  render() {
    return (
      <span>
        <Icon name={this.props.name} title={this.props.title} link color={this.props.color} onClick={this.show}/>
        <Confirm open={this.state.open} onCancel={this.handleCancel} onConfirm={this.handleConfirm}/>
      </span>
    )
  }
}
