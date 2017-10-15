import React from 'react';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Fmt from '../utils/formatters';
import PortfolioEditPage from '../containers/PortfolioEditPage';

const Portfolios = (props) => {
  const {portfolios} = props;

  const new_portfolio = {
      id: '',
      name: '',
  };

  function listPortfolios() {
    return portfolios.map((portfolio,index) => {
      const gainLoss = portfolio.marketValue - portfolio.totalCost;
      const href = `/portfolios/${portfolio.id}`;
      return (
        <Table.Row key={index}>
          <Table.Cell>
            {<PortfolioEditPage portfolio={portfolio} iconName='edit' iconColor='blue' onClickSubmit={props.onClickSubmit}/>}
            <Icon name='remove' link color='red' onClick={() => props.onClickRemove(portfolio)}/>
          </Table.Cell>
          <Table.Cell><Link to={href}>{portfolio.name}</Link></Table.Cell>
          <Table.Cell textAlign='right'>{Fmt.formatCurrency(portfolio.marketValue)}</Table.Cell>
          <Table.Cell textAlign='right'>{Fmt.formatCurrency(portfolio.totalCost)}</Table.Cell>
          <Table.Cell textAlign='right'>{Fmt.formatCurrency(gainLoss)}</Table.Cell>
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
    return (
      <Table.Row>
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{Fmt.formatCurrency(sumMarketValue)}</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{Fmt.formatCurrency(sumTotalCost)}</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{Fmt.formatCurrency(sumMarketValue - sumTotalCost)}</Table.HeaderCell>
      </Table.Row>
    );
  }

  return (
    <Grid columns={1} style={{margin: '1rem'}}>
      <Grid.Row>
        <Grid.Column>
          <Header size='large' content='Portfolios'></Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table celled collapsing padded sortable striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {<PortfolioEditPage portfolio={new_portfolio} iconName='add' iconColor='blue' onClickSubmit={props.onClickSubmit}/>}
                  Add
                </Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Market Value</Table.HeaderCell>
                <Table.HeaderCell>Cost Basis</Table.HeaderCell>
                <Table.HeaderCell>Gain/Loss</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {listPortfolios()}
            </Table.Body>
            <Table.Footer>
              {sumPortfolios()}
            </Table.Footer>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Portfolios;
