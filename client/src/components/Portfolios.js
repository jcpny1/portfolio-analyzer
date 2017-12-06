import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Header, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../containers/ConfirmDialog';
import Portfolio from '../classes/Portfolio';
import PortfolioEditPage from '../containers/PortfolioEditPage';

export const Portfolios = (props) => {
  const {onClickColHeader, onClickRemove, portfolios, refreshPortfolios, sortColName, sortDirection, totalCost, totalDayChange, totalGainLoss, totalMarketValue, updatingPortfolio, userLocale} = props;

  function columnTitles() {
    return (
      <Table.Row textAlign='center'>
        <Table.HeaderCell>{<PortfolioEditPage portfolio={new Portfolio()} iconName='add' iconColor='blue' tooltip='Add a portfolio'/>}</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'name'        ? sortDirection : null} onClick={() => onClickColHeader('name')} textAlign='left'>Portfolios</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'marketValue' ? sortDirection : null} onClick={() => onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'dayChange'   ? sortDirection : null} onClick={() => onClickColHeader('dayChange')}>Day Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'cost'        ? sortDirection : null} onClick={() => onClickColHeader('cost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'gainLoss'    ? sortDirection : null} onClick={() => onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPortfolios() {
    return portfolios.map(portfolio => {
      return (
        <Table.Row key={portfolio.id} textAlign='right'>
          <Table.Cell textAlign='center'>
            {<PortfolioEditPage portfolio={portfolio} iconName='edit' iconColor='blue' tooltip='Edit portfolio'/>}
            {<ConfirmDialog triggerType='icon' name='remove' color='red' title='Delete portfolio' header='Delete Portfolio' onClickConfirm={onClickRemove(portfolio.id)}/>}
          </Table.Cell>
          <Table.Cell textAlign='left'><Link to={`/portfolios/${portfolio.id}`} title='View details'>{portfolio.name}</Link></Table.Cell>
          <Table.Cell>{portfolio.marketValue.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{portfolio.dayChange.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{portfolio.cost.toHTML(userLocale)}</Table.Cell>
          <Table.Cell>{portfolio.gainLoss.toHTML(userLocale)}</Table.Cell>
        </Table.Row>
      );
    });
  }

  function sumPortfolios() {
    return (
      <Table.Row textAlign='right'>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='left'>Total</Table.HeaderCell>
        <Table.HeaderCell>{totalMarketValue.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell>{totalDayChange.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell>{totalCost.toHTML(userLocale)}</Table.HeaderCell>
        <Table.HeaderCell>{totalGainLoss.toHTML(userLocale)}</Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <div>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
        Account Summary
        <span style={{float:'right'}}>
          <Button content='Refresh' icon='refresh' title='Refresh portfolios' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => refreshPortfolios()}/>
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
  onClickColHeader: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshPortfolios: PropTypes.func.isRequired,
  sortColName: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  totalCost: PropTypes.object.isRequired,
  totalDayChange: PropTypes.object.isRequired,
  totalGainLoss: PropTypes.object.isRequired,
  totalMarketValue: PropTypes.object.isRequired,
  updatingPortfolio: PropTypes.bool.isRequired,
  userLocale: PropTypes.string.isRequired,
}
