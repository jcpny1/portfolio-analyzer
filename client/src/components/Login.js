import React from 'react';
import {Button, Form, Grid, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const Login = (props) => {
  const {} = props;

  function forgotPassword() {
    return (
      <Table.Row>
        <Table.HeaderCell>Forgot Password</Table.HeaderCell>
      </Table.Row>
    );
  }

  function signUp() {
    return (
      <Table.Row>
        <Table.HeaderCell>Sign Up</Table.HeaderCell>
      </Table.Row>
    );
  }
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form>
            <Form.Input width={8} className='icon' icon='user' placeholder='Username' name='username'/>
            <Form.Input width={8} className='icon' icon='lock' placeholder='Password' name='password' type='password'/>
            <Button type='submit' color='green'>Submit</Button>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table compact='very' striped>
            <Table.Header>{forgotPassword()}</Table.Header>
            <Table.Header>{signUp()}</Table.Header>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

Login.propTypes = {
  onChange: PropTypes.func.isRequired,
  serverInstruments: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchValue: PropTypes.string.isRequired,
}
