import React from 'react';
import {Form} from 'semantic-ui-react';

const Symbols = (props) => {

  let {name} = props;

  return (
    <Form onSubmit={props.onSubmit}>
      <p>Enter company name.</p>
      <Form.Group>
        <Form.Input width={4} label='Name' placeholder='Name' name='name' value={name} onChange={props.onChange}/>
      </Form.Group>
    </Form>
  );
}

export default Symbols;
