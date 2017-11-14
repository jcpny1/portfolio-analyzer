import React from 'react';
import {Form, Grid, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const Symbols = (props) => {
  const {onChange, symbols, symbolName} = props;

  function columnTitles() {
    return (
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Symbol</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listSymbols() {
    return symbols.map((symbol,index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell width={8}>{symbol.long_name}</Table.Cell>
          <Table.Cell width={3}>{symbol.name}</Table.Cell>
        </Table.Row>
      );
    });
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form>
            <Form.Input width={8} className='icon' icon='search' placeholder='Description' name='value' value={symbolName} onChange={onChange}/>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table compact='very' striped>
            <Table.Header>{columnTitles()}</Table.Header>
            <Table.Body>{listSymbols()}</Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

Symbols.propTypes = {
  onChange: PropTypes.func.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.object).isRequired,
  symbolName: PropTypes.string.isRequired,
}
