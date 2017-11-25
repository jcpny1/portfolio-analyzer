import React from 'react';
import {Form} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const SettingsEdit = (props) => {
  const localeOptions = [ { key: 'de-DE', value: 'de-DE', text: 'German - Germany' }, { key: 'en-US', value: 'en-US', text: 'English-USA' }, { key: 'en-GB', value: 'en-GB', text: 'English-Great Britain' } ];
  const {onChange, onSubmit, settings} = props;

  return (
    <Form id='settingsEditForm' onSubmit={onSubmit}>
      <Form.Group>
        <Form.Select label='Locale' placeholder='Locale' name='locale' options={localeOptions} value={settings.locale} onChange={onChange} required/>
      </Form.Group>
    </Form>
  );
}

SettingsEdit.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}
