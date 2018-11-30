import React from 'react';
import {Form, Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const PositionEdit = (props) => {
  const {formError, onChange, onSubmit, position} = props;
  return (
    <Form id='positionEditForm' onSubmit={onSubmit} error={Object.keys(formError).length !== 0}>
      <Form.Group>
        <Form.Input width={4} error={formError.name === 'symbol'} label='Symbol' placeholder='Symbol' name='symbol' value={position.symbol} onChange={onChange} autoFocus required/>
        <Form.Input width={4} error={formError.name === 'quantity'} label='Quantity' placeholder='Quantity' name='quantity' value={position.quantity} onChange={onChange} required/>
        <Form.Input width={4} error={formError.name === 'cost'} label='Cost Basis' placeholder='Cost Basis' name='cost' value={position.cost} onChange={onChange} required/>
        <Form.Input width={4} error={formError.name === 'dateAcquired'} label='Date Acquired' type='date' placeholder='YYYY-MM-DD' name='dateAcquired' value={position.dateAcquired} onChange={onChange} required/>
      </Form.Group>
      <Message hidden={Object.keys(formError).length !== 0} content='Update portfolio info. Press Cancel or Submit when done.'/>
      <Message error content={formError.message}/>
    </Form>
  );
}

PositionEdit.propTypes = {
  formError: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  position: PropTypes.object.isRequired,
}
