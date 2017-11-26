import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Header, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../containers/ConfirmDialog';
import Fmt from '../utils/formatter';
import PortfolioEditPage from '../containers/PortfolioEditPage';

export const Portfolios = (props) => {
  const {emptyPortfolio, onClickColHeader, onClickRemove, onClickSubmit, portfolios, refreshPortfolios, sortColName, sortDirection, totalCost, totalDayChange, totalGainLoss, totalMarketValue, updatingPortfolio} = props;

  function columnTitles() {
    return (
      <Table.Row textAlign='center'>
        <Table.HeaderCell>{<PortfolioEditPage portfolio={emptyPortfolio} iconName='add' iconColor='blue' tooltip='Add a portfolio' onClickSubmit={onClickSubmit}/>}</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'name'        ? sortDirection : null} onClick={() => onClickColHeader('name')} textAlign='left'>Portfolios</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'marketValue' ? sortDirection : null} onClick={() => onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'dayChange'   ? sortDirection : null} onClick={() => onClickColHeader('dayChange')}>Day Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'cost'        ? sortDirection : null} onClick={() => onClickColHeader('cost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'gainLoss'    ? sortDirection : null} onClick={() => onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPortfolios() {
    return portfolios.map((portfolio,index) => {
      const href = `/portfolios/${portfolio.id}`;
      return (
        <Table.Row key={index} textAlign='right'>
          <Table.Cell textAlign='center'>
            {<PortfolioEditPage portfolio={portfolio} iconName='edit' iconColor='blue' tooltip='Edit portfolio' onClickSubmit={onClickSubmit}/>}
            {<ConfirmDialog triggerType='icon' name='remove' color='red' title='Delete portfolio' header='Delete Portfolio' onClickConfirm={onClickRemove(portfolio.id)}/>}
          </Table.Cell>
          <Table.Cell textAlign='left'><Link to={href} title='View details'>{portfolio.name}</Link></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.marketValue}/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.dayChange} delta/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.cost}/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.gainLoss} delta/></Table.Cell>
        </Table.Row>
      );
    });
  }

  function sumPortfolios() {
    return (
      <Table.Row textAlign='right'>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='left'>Total</Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={totalMarketValue}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={totalDayChange} delta/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={totalCost}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.number type='currency' value={totalGainLoss} delta/></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <div>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
        Account Summary
        <span style={{float:'right'}}>
          <Button content='Refresh' icon='refresh' title='Refresh portfolio' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => refreshPortfolios()}/>
        </span>
      </Header>
      <Table compact sortable striped style={{marginTop:0}}>
        <Table.Header>{columnTitles()}</Table.Header>
        <Table.Body>{listPortfolios()}</Table.Body>
        <Table.Footer>{sumPortfolios()}</Table.Footer>
      </Table>
    </div>
  );
}

Portfolios.propTypes = {
  emptyPortfolio: PropTypes.object.isRequired,
  onClickColHeader: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onClickSubmit: PropTypes.func.isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshPortfolios: PropTypes.func.isRequired,
  sortColName: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  totalCost: PropTypes.number.isRequired,
  totalDayChange: PropTypes.number.isRequired,
  totalGainLoss: PropTypes.number.isRequired,
  totalMarketValue: PropTypes.number.isRequired,
  updatingPortfolio: PropTypes.bool.isRequired,
}
