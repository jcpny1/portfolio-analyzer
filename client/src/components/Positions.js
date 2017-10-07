import React from 'react';
import {formatCurrency} from '../utils/formatters';
import {Icon} from 'semantic-ui-react';
import PositionEdit from '../containers/PositionEdit';

const Positions = (props) => {
  const { positions, prices } = props;

  function listPositions() {
    if ('open_positions' in positions) {
      return positions.open_positions.map((open_position,index) => {
        return (
          <tr key={index}>
            <td className="collapsing">
              {<PositionEdit position={open_position}/>}
              <Icon name='remove' link color='red' onClick={() => props.onRemoveClick(index)}/>
            </td>
            <td>{open_position.stock_symbol.name.toUpperCase()}</td>
            <td className='center aligned'>{prices[open_position.stock_symbol.name]}</td>
            <td className='center aligned'>{open_position.quantity}</td>
            <td className='center aligned'>{formatCurrency(open_position.cost)}</td>
            <td className='center aligned'>{open_position.date_acquired}</td>
          </tr>
      );
      });
    }
    return;
  }

  function sumPositions() {
    let sumQuantity = 0.0;
    let sumCost = 0.0;
    if ("open_positions" in positions) {
      positions.open_positions.forEach(function(open_position) {
        sumQuantity += parseFloat(open_position.quantity);
        sumCost     += parseFloat(open_position.cost);
      });
    }
    return (
      <tr>
        <th>Total</th>
        <th className='center aligned'></th>
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
            <th colSpan='6'><h3>Positions <Icon name='add' link color='blue' onClick={() => props.onAddClick({stock_symbol_id:1})}/></h3></th>
          </tr>
          <tr>
            <th></th>
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
  );
}

export default Positions;
