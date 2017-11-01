import React from 'react';
import {Button, Grid, Header, Icon, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import PortfolioEditPage from '../containers/PortfolioEditPage';
import Fmt from './Formatters';

const Portfolios = (props) => {
  const {portfolios, totalCost, totalDayChange, totalGainLoss, totalMarketValue, updatingPortfolio, sortColName, sortDirection} = props;

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
            <Icon name='remove' title='Delete portfolio' link color='red' onClick={() => props.onClickRemove(portfolio.id)}/>
          </Table.Cell>
          <Table.Cell textAlign='left'><Link to={href} title='View details'>{portfolio.name}</Link></Table.Cell>
          <Table.Cell><Fmt.Currency value={portfolio.marketValue}/></Table.Cell>
          <Table.Cell><Fmt.Currency value={portfolio.dayChange} delta/></Table.Cell>
          <Table.Cell><Fmt.Currency value={portfolio.totalCost}/></Table.Cell>
          <Table.Cell><Fmt.Currency value={portfolio.gainLoss} delta/></Table.Cell>
        </Table.Row>
      );
    });
  }

  function sumPortfolios() {
    return (
      <Table.Row textAlign='right'>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='left'>Total</Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={totalMarketValue}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={totalDayChange} delta/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={totalCost}/></Table.HeaderCell>
        <Table.HeaderCell><Fmt.Currency value={totalGainLoss} delta/></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <Grid.Column>
      <Header content='Account Summary' size='large' color='purple'></Header>
      <Button content='Refresh' icon='refresh' title='Refresh portfolios' loading={updatingPortfolio} size='tiny' inverted compact style={{'color':'darkorchid', 'paddingLeft':'5px'}} onClick={() => props.refreshPortfolios()}/>
      <Table celled compact sortable striped style={{'marginTop':'0'}}>
        <Table.Header>{columnTitles()}</Table.Header>
        <Table.Body>{listPortfolios()}</Table.Body>
        <Table.Footer>{sumPortfolios()}</Table.Footer>
      </Table>
    </Grid.Column>
  );
}

export default Portfolios;
