import React from 'react';
import {Header, Table} from 'semantic-ui-react';

const Headlines = (props) => {
  const {articles} = props;

  function listHeadlines() {
    if (articles) {
      return articles.map((article,index) => {
        return (
          <Table.Row key={index} textAlign='right'>
            <Table.Cell>{article.title}</Table.Cell>
          </Table.Row>
        );
      });
    } else {
      return null;
    }
  }

  return (
    <div>
      <Header content='Headline News' size='medium' color='purple'></Header>
      <Table celled compact sortable striped style={{'marginTop':'0'}}>
        <Table.Body>{listHeadlines()}</Table.Body>
      </Table>
    </div>
  );
}

export default Headlines;
