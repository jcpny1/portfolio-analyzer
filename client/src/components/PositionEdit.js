import React from 'react';
import {Form} from 'semantic-ui-react';

const PositionEdit = (props) => {
  const {position} = props;
  return (
    <Form onSubmit={props.onSubmit}>
      <p>Update position info. Press Cancel or Submit when done.</p>
      <Form.Group>
        <Form.Input width={4} label='Symbol' placeholder='Symbol' name='stock_symbol_name' value={position.stock_symbol_name} onChange={props.onChange} required/>
        <Form.Input width={4} label='Quantity' placeholder='Quantity' name='quantity' value={position.quantity} onChange={props.onChange} required/>
        <Form.Input width={4} label='Cost' placeholder='Cost' name='cost' value={position.cost} onChange={props.onChange} required/>
        <Form.Input width={4} label='Date Acquired' type='date' placeholder='YYYY-MM-DD' name='date_acquired' value={position.date_acquired} onChange={props.onChange}/>
      </Form.Group>
      <Form.Group>
        <Form.Button color='red' content='Cancel' onClick={props.onCancel}/>
        <Form.Button color='green' content='Submit'/>
      </Form.Group>
    </Form>
  );
}

export default PositionEdit;
