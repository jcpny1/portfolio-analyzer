import React from 'react';
import {Button, Grid, Header, Icon, Table} from 'semantic-ui-react';
import Fmt from './Formatters';
import PositionEditPage from '../containers/PositionEditPage';

const Positions = (props) => {
  const {portfolio, sortColName, sortDirection, updatingPortfolio} = props;

  function columnTitles() {
    return (
      <Table.Row textAlign='center' style={{'color':'darkorchid'}}>
        <Table.HeaderCell>{<PositionEditPage position={props.emptyPosition} iconName='add' iconColor='blue' tooltip='Add a position' onClickSubmit={props.onClickSubmit}/>}</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'stock_symbol'  ? sortDirection : null} textAlign='left' onClick={() => props.onClickColHeader('stock_symbol')}>Symbol</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'quantity'      ? sortDirection : null} onClick={() => props.onClickColHeader('quantity')}>Quantity</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastTrade'     ? sortDirection : null} onClick={() => props.onClickColHeader('lastTrade')}>Price</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'priceChange'   ? sortDirection : null} onClick={() => props.onClickColHeader('priceChange')}>Price Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'marketValue'   ? sortDirection : null} onClick={() => props.onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'dayChange'     ? sortDirection : null} onClick={() => props.onClickColHeader('dayChange')}>Day Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'cost'          ? sortDirection : null} onClick={() => props.onClickColHeader('cost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'gainLoss'      ? sortDirection : null} onClick={() => props.onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastTradeDate' ? sortDirection : null} onClick={() => props.onClickColHeader('lastTradeDate')}>Last Trade</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPositions() {
    return portfolio.positions.map((position,index) => {
      return (
        <Table.Row key={index} textAlign='right'>
          <Table.Cell textAlign='center'>
            {<PositionEditPage position={position} iconName='edit' iconColor='blue' tooltip='Edit position' onClickSubmit={props.onClickSubmit}/>}
            <Icon name='remove' title='Delete position' link color='red' onClick={() => props.onClickRemove(portfolio.id, position.id)}/>
          </Table.Cell>
          <Table.Cell textAlign='left'>{position.stock_symbol.name}</Table.Cell>
          <Table.Cell><Fmt.Quantity value={position.quantity}/></Table.Cell>
          <Table.Cell><Fmt.Currency value={position.lastTrade}/></Table.Cell>
          <Table.Cell><Fmt.Currency value={position.priceChange} delta/></Table.Cell>
          <Table.Cell><Fmt.Currency value={position.marketValue}/></Table.Cell>
          <Table.Cell><Fmt.Currency value={position.dayChange} delta/></Table.Cell>
          <Table.Cell><Fmt.Currency value={position.cost}/></Table.Cell>
          <Table.Cell><Fmt.Currency value={position.gainLoss} delta/></Table.Cell>
          <Table.Cell><Fmt.DateTime value={position.lastTradeDate}/></Table.Cell>
        </Table.Row>
      );
    });
  }

  function sumPositions() {
    return (
      <Table.Row textAlign='right'>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='left'>Total</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={portfolio.marketValue}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={portfolio.dayChange} delta/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={portfolio.totalCost}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={portfolio.gainLoss} delta/></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <Grid.Column>
      <Header size='large' color='purple' content={portfolio.name}></Header>
      <Button content='Refresh' icon='refresh' title='Refresh positions' loading={updatingPortfolio} size='tiny' inverted compact style={{'color':'darkorchid', 'paddingLeft':'5px'}} onClick={() => props.refreshPortfolio(portfolio)}/>
      <Table celled compact sortable striped style={{'marginTop':'0'}}>
        <Table.Header>{columnTitles()}</Table.Header>
        <Table.Body>{listPositions()}</Table.Body>
        <Table.Footer>{sumPositions()}</Table.Footer>
      </Table>
    </Grid.Column>
  );
}

export default Positions;
