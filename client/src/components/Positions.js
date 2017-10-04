import React from 'react'

const Positions = (props) => {
  function listPositions() {
    return props.positions.map((food,index) => {
      return (
        <tr key={index} onClick={() => props.onFoodClick(index)}>
          <td><a href="#">{food.quantity}</a></td>
          <td className='right aligned'>{food.kcal}</td>
          <td className='right aligned'>{food.protein_g}</td>
          <td className='right aligned'>{food.fat_g}</td>
          <td className='right aligned'>{food.carbohydrate_g}</td>
        </tr>
      )
    })
  }

  return (
    <div>
      <table className='ui selectable structured large table'>
        <thead>
          <tr>
            <th colSpan='5'><h3>Positions</h3></th>
          </tr>
          <tr>
            <th className='eight wide'>Name</th>
            <th>Kcal</th>
            <th>Protein (g)</th>
            <th>Fat (g)</th>
            <th>Carbs (g)</th>
          </tr>
        </thead>
        <tbody>
          {listPositions()}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th className='right aligned' id='total-kcal'>
              {sum(props.positions, 'kcal')}
            </th>
            <th className='right aligned' id='total-protein_g'>
              {sum(props.positions, 'protein_g')}
            </th>
            <th className='right aligned' id='total-fat_g'>
              {sum(props.positions, 'fat_g')}
            </th>
            <th className='right aligned' id='total-carbohydrate_g'>
              {sum(props.positions, 'carbohydrate_g')}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Positions

function sum(portfolios, prop) {
  return portfolios.reduce((memo, food) => (
    parseInt(food[prop], 10) + memo
  ), 0.0).toFixed(2);
}
