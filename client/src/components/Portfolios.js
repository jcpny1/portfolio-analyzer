import React from 'react';
import {formatCurrency} from '../utils/formatters';
import {Grid, Header, Icon, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import PortfolioEditPage from '../containers/PortfolioEditPage';

const Portfolios = (props) => {
  const new_portfolio = {
      id: '',
      name: '',
  };

  function listPortfolios() {
    return props.portfolios.map((portfolio,index) => {
      let href = `/portfolios/${portfolio.id}`;
      return (
        <Table.Row key={index}>
          <Table.Cell>
            {<PortfolioEditPage portfolio={portfolio} index={index} iconName='edit' iconColor='blue' onClickUpdate={props.onClickUpdate}/>}
            <Icon name='remove' link color='red' onClick={() => props.onClickRemove(portfolio, index)}/>
          </Table.Cell>
          <Table.Cell><Link to={href}>{portfolio.name}</Link></Table.Cell>
          <Table.Cell textAlign='right'>{formatCurrency(portfolio.marketValue)}</Table.Cell>
          <Table.Cell textAlign='right'>{formatCurrency(portfolio.totalCost)}</Table.Cell>
          <Table.Cell textAlign='right'>{formatCurrency(portfolio.marketValue - portfolio.totalCost)}</Table.Cell>
        </Table.Row>
      );
    });
  }

  function sumPortfolios() {
    let sumMarketValue = 0.0;
    let sumTotalCost = 0.0;
    props.portfolios.forEach(function(portfolio) {
      sumMarketValue += parseFloat(portfolio.marketValue);
      sumTotalCost   += parseFloat(portfolio.totalCost);
    });
    return (
      <Table.Row>
        <Table.HeaderCell>Total</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{formatCurrency(sumMarketValue)}</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{formatCurrency(sumTotalCost)}</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>{formatCurrency(sumMarketValue - sumTotalCost)}</Table.HeaderCell>
      </Table.Row>
    );
  }

  // <Container style={{ marginLeft: '7em' }}>
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
                  {<PortfolioEditPage portfolio={new_portfolio} index='-1' iconName='add' iconColor='blue' onClickUpdate={props.onClickUpdate}/>}
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
