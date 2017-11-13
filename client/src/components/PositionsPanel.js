import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import ConfirmDialog from '../containers/ConfirmDialog';
import Fmt from '../utils/formatters';
import PositionEditPage from '../containers/PositionEditPage';
import PositionsTable from './PositionsTable';

const PositionsPanel = (props) => {
  const {emptyPosition, onClickColHeader, onClickRemove, onClickSubmit, portfolio, sortColName, sortDirection, updatingPortfolio} = props;

  return (
    <div>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
        {portfolio.name}
        <span style={{float:'right'}}>
          <Button content='Refresh' icon='refresh' title='Refresh positions' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => props.refreshPortfolio(portfolio)}/>
        </span>
      </Header>
      <PositionsTable emptyPosition={emptyPosition} portfolio={portfolio} sortColName={sortColName} sortDirection={sortDirection} onClickColHeader={onClickColHeader} onClickRemove={onClickRemove} onClickSubmit={onClickSubmit}/>
    </div>
  );
}

export default PositionsPanel;
