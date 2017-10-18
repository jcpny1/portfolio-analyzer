import React from 'react';
import {Form} from 'semantic-ui-react';

const PositionEdit = (props) => {
  let {symbols, stock_symbol_id, quantity, cost, date_acquired} = props;
  return (
    <Form onSubmit={props.onSubmit}>
      <p>Update position info. Press Cancel or Submit when done.</p>
      <Form.Group>
        <Form.Select search options={symbols} width={4} label='Symbol' placeholder='Symbol' name='stock_symbol_id' value={stock_symbol_id} onChange={props.onChange} required/>
        <Form.Input width={4} label='Quantity' placeholder='Quantity' name='quantity' value={quantity} onChange={props.onChange}/>
        <Form.Input width={4} label='Cost' placeholder='Cost' name='cost' value={cost} onChange={props.onChange}/>
        <Form.Input width={4} label='Date Acquired' type='date' placeholder='YYYY-MM-DD' name='date_acquired' value={date_acquired} onChange={props.onChange}/>
      </Form.Group>
      <Form.Group>
        <Form.Button color='red' content='Cancel' onClick={props.onCancel}/>
        <Form.Button color='green' content='Submit'/>
      </Form.Group>
    </Form>
  );
}

export default PositionEdit;
