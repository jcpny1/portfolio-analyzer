import React from 'react';
import {Form} from 'semantic-ui-react';

const PortfolioEdit = (props) => {
  const {name} = props;

  return (
    <Form onSubmit={props.onSubmit}>
      <p>Update portfolio info. Press Cancel or Submit when done.</p>
      <Form.Group>
        <Form.Input width={4} label='Name' placeholder='Name' name='name' value={name} onChange={props.onChange} required/>
      </Form.Group>
      <Form.Group>
        <Form.Button color='red' content='Cancel' onClick={props.onCancel}/>
        <Form.Button color='green' content='Submit'/>
      </Form.Group>
    </Form>
  );
}

export default PortfolioEdit;
