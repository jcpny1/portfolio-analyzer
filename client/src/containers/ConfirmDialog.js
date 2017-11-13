import React, {Component} from 'react'
import {Confirm, Dropdown, Icon} from 'semantic-ui-react'

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
    this.props.onClickConfirm();
  }

  show = () => {
    this.setState({ open: true });
  }

  render() {
    return (
      <span>
        {
          (this.props.triggerType === 'icon') ?
            <Icon name={this.props.name} title={this.props.title} link color={this.props.color} onClick={this.show}/> :
            <Dropdown.Item text={this.props.title} onClick={this.show}/>
        }
        <Confirm
          cancelButton='NO'
          confirmButton='YES'
          closeOnDimmerClick={false}
          header={this.props.header}
          open={this.state.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </span>
    );
  }
}
