import React, {Component} from 'react'
import {Confirm, Dropdown, Icon} from 'semantic-ui-react'
import PropTypes from 'prop-types';

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
    const {color, header, name, title, triggerType} = this.props;
    const {open} = this.state;
    return (
      <span>
        {
          (triggerType === 'icon') ?
            <Icon name={name} title={title} id='portfolioDelete' link color={color} onClick={this.show}/> :
            <Dropdown.Item text={title} onClick={this.show}/>
        }
        <Confirm
          cancelButton='NO'
          confirmButton='YES'
          closeOnDimmerClick={false}
          header={header}
          open={open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </span>
    );
  }
}

ConfirmDialog.propTypes = {
  color: PropTypes.string,
  header: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClickConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  triggerType: PropTypes.string.isRequired,
}
