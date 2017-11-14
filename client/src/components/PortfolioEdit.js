import React from 'react';
import {Form} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const PortfolioEdit = (props) => {
  const {onChange, portfolio} = props;
  return (
    <Form id='portfolioEditForm' onSubmit={props.onSubmit}>
      <Form.Group>
        <Form.Input width={4} label='Name' placeholder='Name' name='name' value={portfolio.name} onChange={onChange} required/>
      </Form.Group>
    </Form>
  );
}

PortfolioEdit.propTypes = {
  portfolio: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
