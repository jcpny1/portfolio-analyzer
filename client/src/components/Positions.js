import React from 'react'
import {formatCurrency} from '../utils/formatters'

const Positions = (props) => {
  function listPositions() {
    if ("open_positions" in props.positions) {
      return props.positions.open_positions.map((open_position,index) => {
        return (
          <tr key={index}>
            <td>{open_position.stock_symbol.name.toUpperCase()}</td>
            <th className='center aligned'>0.0</th>
            <td className='center aligned'>{open_position.quantity}</td>
            <td className='center aligned'>{formatCurrency(open_position.cost)}</td>
            <td className='center aligned'>{open_position.date_acquired}</td>
          </tr>
        );
      })
    }
    return;
  }

  function sumPositions() {
    let sumQuantity = 0.0;
    let sumCost = 0.0;
    if ("open_positions" in props.positions) {
      props.positions.open_positions.forEach(function(open_position) {
        sumQuantity += parseFloat(open_position.quantity);
        sumCost     += parseFloat(open_position.cost);
      });
    }
    return (
      <tr>
        <th>Total</th>
        <th className='center aligned'></th>
        <th className='center aligned'>{sumQuantity}</th>
        <th className='center aligned'>{formatCurrency(sumCost)}</th>
        <th className='center aligned'></th>
      </tr>
    );
  }

  return (
    <div>
      <table className='ui celled padded table'>
        <thead>
          <tr>
            <th colSpan='4'><h3>Positions</h3></th>
          </tr>
          <tr>
            <th>Symbol</th>
            <th className='center aligned'>Last Close</th>
            <th className='center aligned'>Quantity</th>
            <th className='center aligned'>Cost Basis</th>
            <th className='center aligned'>Acquired</th>
          </tr>
        </thead>
        <tbody>
          {listPositions()}
        </tbody>
        <tfoot>
          {sumPositions()}
        </tfoot>
      </table>
    </div>
  )
}
// <tfoot>
//   <tr>
//     <th>Total</th>
//     <th className='right aligned' id='total-kcal'>
//       {sum(props.positions, 'kcal')}
//     </th>
//     <th className='right aligned' id='total-protein_g'>
//       {sum(props.positions, 'protein_g')}
//     </th>
//     <th className='right aligned' id='total-fat_g'>
//       {sum(props.positions, 'fat_g')}
//     </th>
//     <th className='right aligned' id='total-carbohydrate_g'>
//       {sum(props.positions, 'carbohydrate_g')}
//     </th>
//   </tr>
// </tfoot>

export default Positions

function sum(portfolios, prop) {
  return portfolios.reduce((memo, open_position) => (
    parseInt(open_position[prop], 10) + memo
  ), 0.0).toFixed(2);
}
