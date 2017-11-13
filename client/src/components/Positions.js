import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import ConfirmDialog from '../containers/ConfirmDialog';
import Fmt from '../utils/formatters';
import PositionEditPage from '../containers/PositionEditPage';

const Positions = (props) => {
  const {portfolio, sortColName, sortDirection, updatingPortfolio} = props;

  function columnTitles() {
    return (
      <Table.Row textAlign='center'>
        <Table.HeaderCell>{<PositionEditPage position={props.emptyPosition} iconName='add' iconColor='blue' tooltip='Add a position' onClickSubmit={props.onClickSubmit}/>}</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'stock_symbol'  ? sortDirection : null} textAlign='left' onClick={() => props.onClickColHeader('stock_symbol')}>Symbol</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'quantity'      ? sortDirection : null} onClick={() => props.onClickColHeader('quantity')}>Quantity</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastTrade'     ? sortDirection : null} onClick={() => props.onClickColHeader('lastTrade')}>Price</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'priceChange'   ? sortDirection : null} onClick={() => props.onClickColHeader('priceChange')}>Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'marketValue'   ? sortDirection : null} onClick={() => props.onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'dayChange'     ? sortDirection : null} onClick={() => props.onClickColHeader('dayChange')}>Day Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'cost'          ? sortDirection : null} onClick={() => props.onClickColHeader('cost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'gainLoss'      ? sortDirection : null} onClick={() => props.onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastTradeDate' ? sortDirection : null} onClick={() => props.onClickColHeader('lastTradeDate')}>Last Trade</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastUpdate'    ? sortDirection : null} onClick={() => props.onClickColHeader('lastUpdate')}>Last Update</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPositions() {
    return portfolio.positions.map((position,index) => {
      return (
        <Table.Row key={index} textAlign='right'>
          <Table.Cell textAlign='center'>
            {<PositionEditPage position={position} iconName='edit' iconColor='blue' tooltip='Edit position' onClickSubmit={props.onClickSubmit}/>}
            {<ConfirmDialog triggerType='icon' name='remove' color='red' title='Delete position' header='Delete Position' onClickConfirm={props.onClickRemove(portfolio.id, position.id)}/>}
          </Table.Cell>
          <Table.Cell textAlign='left' title={position.stock_symbol.long_name}>{position.stock_symbol.name}</Table.Cell>
          <Table.Cell><Fmt.number type='quantity' value={position.quantity} quantity/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={position.lastTrade}/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={position.priceChange} delta/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={position.marketValue}/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={position.dayChange} delta/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={position.cost}/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={position.gainLoss} delta/></Table.Cell>
          <Table.Cell><Fmt.dateTime value={position.lastTradeDate}/></Table.Cell>
          <Table.Cell><Fmt.dateTime value={position.lastUpdate}/></Table.Cell>
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
        <Table.HeaderCell><Fmt.number type='currency' value={portfolio.marketValue}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={portfolio.dayChange} delta/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={portfolio.totalCost}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={portfolio.gainLoss} delta/></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <div>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
        {portfolio.name}
        <span style={{float:'right'}}>
          <Button content='Refresh' icon='refresh' title='Refresh positions' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => props.refreshPortfolio(portfolio)}/>
        </span>
      </Header>
      <Table compact sortable striped style={{marginTop:0}}>
        <Table.Header>{columnTitles()}</Table.Header>
        <Table.Body>{listPositions()}</Table.Body>
        <Table.Footer>{sumPositions()}</Table.Footer>
      </Table>
    </div>
  );
}

export default Positions;
