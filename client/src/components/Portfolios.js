import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Header, Table} from 'semantic-ui-react';
import ConfirmDialog from '../containers/ConfirmDialog';
import Fmt from '../utils/formatters';
import PortfolioEditPage from '../containers/PortfolioEditPage';

const Portfolios = (props) => {
  const {portfolios, sortColName, sortDirection, totalCost, totalDayChange, totalGainLoss, totalMarketValue, updatingPortfolio} = props;

  function columnTitles() {
    return (
      <Table.Row textAlign='center'>
        <Table.HeaderCell>{<PortfolioEditPage portfolio={props.emptyPortfolio} iconName='add' iconColor='blue' tooltip='Add a portfolio' onClickSubmit={props.onClickSubmit}/>}</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'name'        ? sortDirection : null} onClick={() => props.onClickColHeader('name')} textAlign='left'>Portfolios</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'marketValue' ? sortDirection : null} onClick={() => props.onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'dayChange'   ? sortDirection : null} onClick={() => props.onClickColHeader('dayChange')}>Day Change</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'totalCost'   ? sortDirection : null} onClick={() => props.onClickColHeader('totalCost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell sorted={sortColName === 'gainLoss'    ? sortDirection : null} onClick={() => props.onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPortfolios() {
    return portfolios.map((portfolio,index) => {
      const href = `/portfolios/${portfolio.id}`;
      return (
        <Table.Row key={index} textAlign='right'>
          <Table.Cell textAlign='center'>
            {<PortfolioEditPage portfolio={portfolio} iconName='edit' iconColor='blue' tooltip='Edit portfolio' onClickSubmit={props.onClickSubmit}/>}
            {<ConfirmDialog triggerType='icon' name='remove' color='red' title='Delete portfolio' header='Delete Portfolio' onClickConfirm={props.onClickRemove(portfolio.id)}/>}
          </Table.Cell>
          <Table.Cell textAlign='left'><Link to={href} title='View details'>{portfolio.name}</Link></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.marketValue}/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.dayChange} delta/></Table.Cell>
          <Table.Cell><Fmt.number type='currency' value={portfolio.totalCost}/></Table.Cell>
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
          <Button content='Refresh' icon='refresh' title='Refresh portfolio' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => props.refreshPortfolios()}/>
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

export default Portfolios;
