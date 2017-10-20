import React from 'react';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import Fmt from './Formatters';
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

  function columnTitles() {
    return (
      <Table.Row>
        <Table.HeaderCell>{<PositionEditPage position={new_position} stock_symbols={props.stockSymbols} iconName='add' iconColor='blue' onClickSubmit={props.onClickSubmit}/>}Add</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('stock_symbol')}>Symbol</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('lastClosePrice')}>Last Close</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('quantity')}>Quantity</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('cost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('date_acquired')}>Acquired</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPositions() {
    if (portfolio !== undefined) {
      return portfolio.open_positions.map((open_position,index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>
              {<PositionEditPage position={open_position} stock_symbols={props.stockSymbols} iconName='edit' iconColor='blue' onClickSubmit={props.onClickSubmit}/>}
              <Icon name='remove' link color='red' onClick={() => props.onClickRemove(open_position)}/>
            </Table.Cell>
            <Table.Cell>{open_position.stock_symbol.name}</Table.Cell>
            <Table.Cell textAlign='right'><Fmt.Currency value={open_position.lastClosePrice}/></Table.Cell>
            <Table.Cell textAlign='right'><Fmt.Quantity value={open_position.quantity}/></Table.Cell>
            <Table.Cell textAlign='right'><Fmt.Currency value={open_position.marketValue}/></Table.Cell>
            <Table.Cell textAlign='right'><Fmt.Currency value={open_position.cost}/></Table.Cell>
            <Table.Cell textAlign='right'><Fmt.Currency value={open_position.gainLoss}/></Table.Cell>
            <Table.Cell>{open_position.date_acquired}</Table.Cell>
          </Table.Row>
        );
      });
    }
    return;
  }

  function sumPositions() {
    return (
      <Table.Row>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'><Fmt.Currency value={props.portfolio.marketValue}/></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'><Fmt.Currency value={props.portfolio.totalCost}/></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'><Fmt.Currency value={props.portfolio.gainLoss}/></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <Grid columns={1} style={{margin: '1rem'}}>
      <Grid.Row>
        <Grid.Column width={4}>
          <Header size='large' color='purple' content={portfolio.name}></Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={7}>
          <Table celled collapsing padded sortable striped>
            <Table.Header>{columnTitles()}</Table.Header>
            <Table.Body>{listPositions()}</Table.Body>
            <Table.Footer>{sumPositions()}</Table.Footer>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Positions;
