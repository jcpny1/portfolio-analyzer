import React from 'react';
import {Form, Grid, Table} from 'semantic-ui-react';

const Symbols = (props) => {
  const {companyName, stockSymbols} = props;

  function columnTitles() {
    return (
      <Table.Row>
        <Table.HeaderCell>Company</Table.HeaderCell>
        <Table.HeaderCell>Symbol</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listCompanies() {
    return stockSymbols.map((stockSymbol,index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell width={8}>{stockSymbol.company.name}</Table.Cell>
          <Table.Cell width={3}>{stockSymbol.name}</Table.Cell>
        </Table.Row>
      );
    });
  }

  return (
    <Grid style={{'marginLeft': '1rem'}}>
      <Grid.Row>
        <Grid.Column>
          <Form>
            <Form.Input width={4} className='icon' icon='search' placeholder='Company Name' name='value' value={companyName} onChange={props.onChange}/>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table columns={2} striped>
            <Table.Header>{columnTitles()}</Table.Header>
            <Table.Body>{listCompanies()}</Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Symbols;
