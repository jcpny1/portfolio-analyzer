import React from 'react';
import {formatCurrency, formatQuantity} from '../utils/formatters';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import PositionEditPage from '../containers/PositionEditPage';

const Positions = (props) => {
  const {portfolio_id, positions, prices} = props;

  const new_position = {
      id: '',
      portfolio_id: portfolio_id,
      stock_symbol: {},
      stock_symbol_name: '',
      quantity: '',
      cost: '',
      date_acquired: '',
  };

  function listPositions() {
    if ('open_positions' in positions) {
      return positions.open_positions.map((open_position,index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>
              {<PositionEditPage position={open_position} index={index} stock_symbols={props.stock_symbols} iconName='edit' iconColor='blue' onClickUpdate={props.onClickUpdate}/>}
              <Icon name='remove' link color='red' onClick={() => props.onClickRemove(open_position, index)}/>
            </Table.Cell>
            <Table.Cell>{open_position.stock_symbol.name}</Table.Cell>
            <Table.Cell textAlign='right'>{prices[open_position.stock_symbol.name]}</Table.Cell>
            <Table.Cell textAlign='right'>{formatQuantity(open_position.quantity)}</Table.Cell>
            <Table.Cell textAlign='right'>{formatCurrency(open_position.cost)}</Table.Cell>
            <Table.Cell textAlign='right'>{formatCurrency((open_position.quantity * prices[open_position.stock_symbol.name])-open_position.cost)}</Table.Cell>
            <Table.Cell>{open_position.date_acquired}</Table.Cell>
          </Table.Row>
        );
      });
    }
    return;
  }

  function sumPositions() {
    let sumCost = 0.0;
    let sumGL = 0.0;
    let sumQuantity = 0.0;

    if ("open_positions" in positions) {
      positions.open_positions.forEach(function(open_position) {
        sumQuantity += parseFloat(open_position.quantity);
        sumCost     += parseFloat(open_position.cost);
        sumGL       += (parseFloat(open_position.quantity) * parseFloat(prices[open_position.stock_symbol.name]))-parseFloat(open_position.cost)
      });
    }
    return (
      <Table.Row>
      <Table.HeaderCell>Total</Table.HeaderCell>
      <Table.HeaderCell></Table.HeaderCell>
      <Table.HeaderCell></Table.HeaderCell>
      <Table.HeaderCell textAlign='right'>{formatQuantity(sumQuantity)}</Table.HeaderCell>
      <Table.HeaderCell textAlign='right'>{formatCurrency(sumCost)}</Table.HeaderCell>
      <Table.HeaderCell textAlign='right'>{formatCurrency(sumGL)}</Table.HeaderCell>
      <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <Grid columns={1} style={{margin: '1rem'}}>
      <Grid.Row>
        <Grid.Column>
          <Header size='large' content='Positions'></Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table celled collapsing padded sortable striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {<PositionEditPage position={new_position} index='-1' stock_symbols={props.stock_symbols} iconName='add' iconColor='blue' onClickUpdate={props.onClickUpdate}/>}
                  Add
                </Table.HeaderCell>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>Last Close</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Cost Basis</Table.HeaderCell>
                <Table.HeaderCell>Gain/Loss</Table.HeaderCell>
                <Table.HeaderCell>Acquired</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {listPositions()}
            </Table.Body>
            <Table.Footer>
              {sumPositions()}
            </Table.Footer>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Positions;
