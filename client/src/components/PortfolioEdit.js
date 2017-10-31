import React from 'react';
import {Form} from 'semantic-ui-react';

const PortfolioEdit = (props) => {
  const {portfolio} = props;
  return (
    <Form id='portfolioEditForm' onSubmit={props.onSubmit}>
      <p>Update portfolio info. Press Cancel or Submit when done.</p>
      <Form.Group>
        <Form.Input width={4} label='Name' placeholder='Name' name='name' value={portfolio.name} onChange={props.onChange} required/>
      </Form.Group>
    </Form>
  );
}

export default PortfolioEdit;
