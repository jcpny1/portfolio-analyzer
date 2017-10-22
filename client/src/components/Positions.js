import React from 'react';
import {Button, Grid, Header, Icon, Table} from 'semantic-ui-react';
import Fmt from './Formatters';
import PositionEditPage from '../containers/PositionEditPage';

const Positions = (props) => {
  const {portfolio} = props;

  const new_position = {
      portfolio_id: portfolio.id,
      id: '',
      stock_symbol: {},
      quantity: '',
      cost: '',
      date_acquired: '',
  };

  function columnTitles() {
    return (
      <Table.Row>
        <Table.HeaderCell>{<PositionEditPage position={new_position} stock_symbols={props.stockSymbols} iconName='add' iconColor='blue' actionName='Add' tooltip='Add a position' onClickSubmit={props.onClickSubmit}/>}</Table.HeaderCell>
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
    return portfolio.open_positions.map((position,index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>
            {<PositionEditPage position={position} stock_symbols={props.stockSymbols} iconName='edit' iconColor='blue' actionName='' tooltip='Edit position' onClickSubmit={props.onClickSubmit}/>}
            <Icon name='remove' title='Delete position' link color='red' onClick={() => props.onClickRemove(position)}/>
          </Table.Cell>
          <Table.Cell>{position.stock_symbol.name}</Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={position.lastClosePrice}/></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Quantity value={position.quantity}/></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={position.marketValue}/></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={position.cost}/></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={position.gainLoss}/></Table.Cell>
          <Table.Cell>{position.date_acquired}</Table.Cell>
        </Table.Row>
      );
    });
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
    <Grid columns={2} style={{'margin': '1rem 1rem 0rem 0rem','padding':'0px 15px'}}>
      <Grid.Row>
        <Grid.Column width={7}>
          <Header size='large' color='purple' content={portfolio.name}></Header>
        </Grid.Column>
        <Grid.Column width={9}>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign='right' width={7}>
          <Button content='Refresh' icon='refresh' attached='left' size='tiny' inverted compact style={{'color':'darkorchid', 'padding':'0'}} onClick={() => props.refreshPortfolio(portfolio)}/>
          <Table celled compact sortable striped style={{'margin':'0','padding':'0'}}>
            <Table.Header>{columnTitles()}</Table.Header>
            <Table.Body>{listPositions()}</Table.Body>
            <Table.Footer>{sumPositions()}</Table.Footer>
          </Table>
        </Grid.Column>
        <Grid.Column width={9}>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Positions;
