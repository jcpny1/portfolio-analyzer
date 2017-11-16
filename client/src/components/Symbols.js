import React from 'react';
import {Form, Grid, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const Symbols = (props) => {
  const {onChange, instruments, searchValue} = props;

  function columnTitles() {
    return (
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Symbol</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listInstruments() {
    return instruments.map((instrument,index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell width={8}>{instrument.name}</Table.Cell>
          <Table.Cell width={3}>{instrument.symbol}</Table.Cell>
        </Table.Row>
      );
    });
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form>
            <Form.Input width={8} className='icon' icon='search' placeholder='Description' name='searchValue' value={searchValue} onChange={onChange}/>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table compact='very' striped>
            <Table.Header>{columnTitles()}</Table.Header>
            <Table.Body>{listInstruments()}</Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

Symbols.propTypes = {
  onChange: PropTypes.func.isRequired,
  instruments: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchValue: PropTypes.string.isRequired,
}
