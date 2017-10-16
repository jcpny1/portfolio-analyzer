import React from 'react';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import Fmt from '../utils/Formatters';
import PositionEditPage from '../containers/PositionEditPage';

const Positions = (props) => {
  const {portfolio} = props;

  const new_position = {
      id: '',
      portfolio_id: portfolio.id,
      stock_symbol: {},
      quantity: '',
      cost: '',
      date_acquired: '',
  };

  function listPositions() {
    if (portfolio !== undefined) {
      return portfolio.open_positions.map((open_position,index) => {
        const marketValue = open_position.quantity * open_position.lastClosePrice;
        const gainLoss = marketValue - open_position.cost;
        return (
          <Table.Row key={index}>
            <Table.Cell>
              {<PositionEditPage position={open_position} stock_symbols={props.stockSymbols} iconName='edit' iconColor='blue' onClickSubmit={props.onClickSubmit}/>}
              <Icon name='remove' link color='red' onClick={() => props.onClickRemove(open_position)}/>
            </Table.Cell>
            <Table.Cell>{open_position.stock_symbol.name}</Table.Cell>
            <Table.Cell textAlign='right'>{open_position.lastClosePrice}</Table.Cell>
            <Table.Cell textAlign='right'>{Fmt.formatQuantity(open_position.quantity)}</Table.Cell>
            <Table.Cell textAlign='right'>{Fmt.formatCurrency(marketValue)}</Table.Cell>
            <Table.Cell textAlign='right'>{Fmt.formatCurrency(open_position.cost)}</Table.Cell>
            <Table.Cell textAlign='right'>{Fmt.formatCurrency(gainLoss)}</Table.Cell>
            <Table.Cell>{open_position.date_acquired}</Table.Cell>
          </Table.Row>
        );
      });
    }
    return;
  }

  function sumPositions() {
    const gainLoss = props.portfolio.marketValue-props.portfolio.totalCost;
    return (
      <Table.Row>
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{Fmt.formatCurrency(props.portfolio.marketValue)}</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{Fmt.formatCurrency(props.portfolio.totalCost)}</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{Fmt.formatCurrency(gainLoss)}</Table.HeaderCell>
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
                  {<PositionEditPage position={new_position} stock_symbols={props.stockSymbols} iconName='add' iconColor='blue' onClickSubmit={props.onClickSubmit}/>}
                  Add
                </Table.HeaderCell>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>Last Close</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Market Value</Table.HeaderCell>
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
