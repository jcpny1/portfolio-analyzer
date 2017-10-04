import React from 'react'
import {formatCurrency} from '../utils/formatters'

const Portfolios = (props) => {
  function listPortfolios() {
    return props.portfolios.map((portfolio,index) => {
      let href = `/portfolios/${portfolio.id}`;
      return (
        <tr key={index}>
          <td><a href={href}>{portfolio.name}</a></td>
          <td className='center aligned'>{formatCurrency(portfolio.marketValue)}</td>
          <td className='center aligned'>{formatCurrency(portfolio.totalCost)}</td>
          <td className='center aligned'>{formatCurrency(portfolio.marketValue - portfolio.totalCost)}</td>
        </tr>
      )
    })
  }

  function sumPortfolios() {
    let sumMarketValue = 0.0;
    let sumTotalCost = 0.0;
    props.portfolios.forEach(function(portfolio) {
      sumMarketValue += parseFloat(portfolio.marketValue);
      sumTotalCost += parseFloat(portfolio.totalCost);
    });
    return (
      <tr>
        <th>Total</th>
        <th className='center aligned'>{formatCurrency(sumMarketValue)}</th>
        <th className='center aligned'>{formatCurrency(sumTotalCost)}</th>
        <th className='center aligned'>{formatCurrency(sumMarketValue - sumTotalCost)}</th>
      </tr>
    )
  }

  return (
    <div>
      <table className='ui celled padded table'>
        <thead>
          <tr>
            <th colSpan='4'><h3>Portfolios</h3></th>
          </tr>
          <tr>
            <th>Name</th>
            <th className='center aligned'>Market Value</th>
            <th className='center aligned'>Cost Basis</th>
            <th className='center aligned'>Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {listPortfolios()}
        </tbody>
        <tfoot>
          {sumPortfolios()}
        </tfoot>
      </table>
    </div>
  )
}

export default Portfolios

function sum(portfolios, prop) {
  return portfolios.reduce((memo, portfolio) => (
    parseInt(portfolio[prop], 10) + memo
  ), 0.0).toFixed(2);
}
