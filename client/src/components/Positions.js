import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import ConfirmDialog from '../containers/ConfirmDialog';
import PropTypes from 'prop-types';
import Position  from '../classes/Position';
import PortfolioChartPage from '../containers/PortfolioChartPage';
import PositionEditPage from '../containers/PositionEditPage';

export const Positions = (props) => {
  const {onClickColHeader, onClickRemove, portfolio, portfolioRefresh, sortColName, sortDirection, updatingPortfolio, userLocale} = props;

  function columnTitles() {
    return (
      <Table.Row textAlign='center'>
        <Table.HeaderCell>{<PositionEditPage position={new Position(portfolio.id)} iconName='add' iconColor='blue' tooltip='Add a position'/>}</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'symbol'        ? sortDirection : null} textAlign='left' onClick={() => onClickColHeader('symbol')}>Symbol</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'quantity'      ? sortDirection : null} onClick={() => onClickColHeader('quantity')}>Quantity</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastTrade'     ? sortDirection : null} onClick={() => onClickColHeader('lastTrade')}>Price</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'priceChange'   ? sortDirection : null} onClick={() => onClickColHeader('priceChange')}>Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'marketValue'   ? sortDirection : null} onClick={() => onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'pctTotalMV'    ? sortDirection : null} onClick={() => onClickColHeader('pctTotalMV')}>% of Portfolio</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'dayChange'     ? sortDirection : null} onClick={() => onClickColHeader('dayChange')}>Day Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'cost'          ? sortDirection : null} onClick={() => onClickColHeader('cost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'gainLoss'      ? sortDirection : null} onClick={() => onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'lastTradeDate' ? sortDirection : null} onClick={() => onClickColHeader('lastTradeDate')}>Last Trade</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPositions(positions, totalMV) {
    return positions.map(position => {
      position.pctTotalMV = position.marketValue / totalMV;
      return (
        <Table.Row key={position.id} textAlign='right'>
          <Table.Cell textAlign='center'>
            {<PositionEditPage position={position} iconName='edit' iconColor='blue' tooltip='Edit position'/>}
            {<ConfirmDialog triggerType='icon' name='remove' color='red' title='Delete position' header='Delete Position' onClickConfirm={onClickRemove(portfolio.id, position.id)}/>}
          </Table.Cell>
          <Table.Cell textAlign='left' title={position.instrument.name}>{position.instrument.toHTML(position.gainLoss)}</Table.Cell>
          <Table.Cell>{position.quantity.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.lastTrade.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.priceChange.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.marketValue.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.pctTotalMV.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.dayChange.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.cost.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.gainLoss.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{position.lastTradeDate.toHTML(userLocale)}</Table.Cell>
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
        <Table.HeaderCell>{portfolio.marketValue.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell>{portfolio.dayChange.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell>{portfolio.cost.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell>{portfolio.gainLoss.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <div>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
        {portfolio.name}
        <span>
          &emsp;{<PortfolioChartPage portfolio={portfolio} iconName='chart line' iconColor='blue' tooltip='Chart portfolio'/>}
        </span>
        <span style={{float:'right'}}>
          <Button content='Refresh' icon='refresh' title='Refresh positions' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => portfolioRefresh(portfolio)}/>
        </span>
      </Header>
      <Table compact sortable striped style={{marginTop:0}}>
        <Table.Header>{columnTitles()}</Table.Header>
        <Table.Body>{listPositions(portfolio.positions, portfolio.marketValue)}</Table.Body>
        <Table.Footer>{sumPositions()}</Table.Footer>
      </Table>
    </div>
  );
}

Positions.propTypes = {
  onClickColHeader: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  portfolio: PropTypes.object.isRequired,
  portfolioRefresh: PropTypes.func.isRequired,
  sortColName: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  updatingPortfolio: PropTypes.bool.isRequired,
  userLocale: PropTypes.string.isRequired,
}
