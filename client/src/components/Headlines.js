import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';

const Headlines = (props) => {
  const {articles} = props;

  function listHeadlines() {
    if (articles) {
      return articles.map((article,index) => {
        // <Grid.Row key={index} style={{margin: 0, padding: '3px'}}>
        //   <Grid.Column>
        return (
          <Table.Row key={index}>
            <Table.Cell>
              <a href={article.url} title={article.description} target='_blank' rel='noopener noreferrer'><span style={{fontWeight:article.fontWeight}}>{article.title}.</span></a>
            </Table.Cell>
          </Table.Row>
        );
      });
    } else {
      return null;
    }
  }

  return (
    <div>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
        Headline News
        <span style={{float:'right'}}>
          <Button disabled content='Refresh: 1 min' icon='refresh' title='Refresh headlines' size='tiny' inverted compact style={{'color':'darkorchid', 'paddingLeft':'5px'}} onClick={() => props.refreshHeadlines()}/>
        </span>
      </Header>
      <Table celled compact sortable striped style={{marginTop:0}}>
        <Table.Body>{listHeadlines()}</Table.Body>
        </Table>
    </div>
  );
}

export default Headlines;
