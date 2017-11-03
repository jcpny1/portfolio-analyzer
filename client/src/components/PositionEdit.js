import React from 'react';
import {Form, Message} from 'semantic-ui-react';

const PositionEdit = (props) => {
  const {formError, position} = props;
  return (
    <Form id='positionEditForm' onSubmit={props.onSubmit} error={Object.keys(formError).length !== 0}>
      <p>Update position info. Press Cancel or Submit when done.</p>
      <Form.Group>
        <Form.Input width={4} error={formError.name === 'stock_symbol_name'} label='Symbol' placeholder='Symbol' name='stock_symbol_name' value={position.stock_symbol_name} onChange={props.onChange} required/>
        <Form.Input width={4} error={formError.name === 'quantity'} label='Quantity' placeholder='Quantity' name='quantity' value={position.quantity} onChange={props.onChange} required/>
        <Form.Input width={4} error={formError.name === 'cost'} label='Cost Basis' placeholder='Cost Basis' name='cost' value={position.cost} onChange={props.onChange} required/>
        <Form.Input width={4} error={formError.name === 'date_acquired'} label='Date Acquired' type='date' placeholder='YYYY-MM-DD' name='date_acquired' value={position.date_acquired} onChange={props.onChange} required/>
      </Form.Group>
      <Message error content={formError.message}/>
    </Form>
  );
}

export default PositionEdit;
