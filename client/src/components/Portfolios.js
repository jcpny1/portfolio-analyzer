import React from 'react';
import {formatCurrency, formatQuantity} from '../utils/formatters';
import {Header, Icon, Table} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Portfolios = (props) => {
  function listPortfolios() {
    return props.portfolios.map((portfolio,index) => {
      let href = `/portfolios/${portfolio.id}`;
      return (
        <Table.Row key={index}>
          <Table.Cell>
            <Icon name='remove' link color='red'/>
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

  return (
    <div>
    <Header size='large' content='Portfolios'></Header>
      <Table celled collapsing padded sortable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
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
    </div>
  );
}

export default Portfolios;
