import React from 'react';
import {Header, Table} from 'semantic-ui-react';

const Headlines = () => {
  return (
    <div>
      <Header content='Headline News' size='medium' color='purple'></Header>
      <Table celled compact sortable striped style={{'marginTop':'0'}}>
      </Table>
    </div>
  );
}

export default Headlines;
