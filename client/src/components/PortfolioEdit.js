import React from 'react';
import {Form} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const PortfolioEdit = (props) => {
  const {onChange, onSubmit, portfolio} = props;
  return (
    <Form id='portfolioEditForm' onSubmit={onSubmit}>
      <Form.Group>
        <Form.Input width={4} label='Name' placeholder='Name' name='name' value={portfolio.name} onChange={onChange} autoFocus required/>
      </Form.Group>
    </Form>
  );
}

PortfolioEdit.propTypes = {
  portfolio: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
