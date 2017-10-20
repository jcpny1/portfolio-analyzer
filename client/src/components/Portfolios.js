import React from 'react';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import PortfolioEditPage from '../containers/PortfolioEditPage';
import Fmt from './Formatters';

const Portfolios = (props) => {
  const {portfolios} = props;

  const new_portfolio = {
      id: '',
      name: '',
  };

  function columnTitles() {
    return (
      <Table.Row>
        <Table.HeaderCell>{<PortfolioEditPage portfolio={new_portfolio} iconName='add' iconColor='blue' actionName='Add' tooltip='Add a portfolio' onClickSubmit={props.onClickSubmit}/>}</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('name')}>Portfolios</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('marketValue')}>Market Value</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('totalCost')}>Cost Basis</Table.HeaderCell>
        <Table.HeaderCell onClick={() => props.onClickColHeader('gainLoss')}>Gain/Loss</Table.HeaderCell>
      </Table.Row>
    );
  }

  function listPortfolios() {
    return portfolios.map((portfolio,index) => {
      const href = `/portfolios/${portfolio.id}`;
      return (
        <Table.Row key={index}>
          <Table.Cell>
            {<PortfolioEditPage portfolio={portfolio} iconName='edit' iconColor='blue' actionName='' tooltip='Edit portfolio' onClickSubmit={props.onClickSubmit}/>}
            <Icon name='remove' title='Delete portfolio' link color='red' onClick={() => props.onClickRemove(portfolio)}/>
          </Table.Cell>
          <Table.Cell><Link to={href} title='View details'>{portfolio.name}</Link></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={portfolio.marketValue}/></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={portfolio.totalCost}/></Table.Cell>
          <Table.Cell textAlign='right'><Fmt.Currency value={portfolio.gainLoss}/></Table.Cell>
        </Table.Row>
      );
    });
  }

  function sumPortfolios() {
    let sumMarketValue = 0.0, sumTotalCost = 0.0;
    portfolios.forEach(function(portfolio) {
      sumMarketValue += parseFloat(portfolio.marketValue);
      sumTotalCost   += parseFloat(portfolio.totalCost);
    });
    const totalGainLoss = sumMarketValue - sumTotalCost;
    return (
      <Table.Row>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'><Fmt.Currency value={sumMarketValue}/></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'><Fmt.Currency value={sumTotalCost}/></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'><Fmt.Currency value={totalGainLoss}/></Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <Grid columns={1} style={{'marginLeft': '1rem'}}>
      <Grid.Row>
        <Grid.Column>
          <Header size='large' color='purple' content='Account Summary'></Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table celled collapsing sortable striped>
            <Table.Header>{columnTitles()}</Table.Header>
            <Table.Body>{listPortfolios()}</Table.Body>
            <Table.Footer>{sumPortfolios()}</Table.Footer>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Portfolios;
