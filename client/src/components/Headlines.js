import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import Fmt from '../utils/formatters';

const Headlines = (props) => {
  const {articles, djia, refreshTime} = props;

  function formatIndex(name, values) {
    return (
      <span>
        {name}: <Fmt.currency value={values.price} color='darkorchid'/>&emsp;<Fmt.currency value={values.change} delta/>
      </span>
    );
  }

  function listHeadlines() {
    if (articles) {
      return articles.map((article,index) => {
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
    <span>
      <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'3px'}}>
        Headline News
        <span disabled style={{color:'plum', float:'right', fontSize:'70%'}}>
          <Button disabled content={formatIndex('DJIA', djia)} title='Dow Jones Industrial Average' size='tiny' inverted compact style={{'color':'darkorchid', 'margin':'0', 'padding':'5px'}}/>
          &emsp;
          <Button disabled content={refreshTime.toLocaleTimeString("en-US")} title='Refresh time' size='tiny' inverted compact style={{'color':'darkorchid', 'margin':'0', 'padding':'5px'}}/>
          &emsp;
          <Button disabled content='Refresh: 1 min' icon='refresh' title='Refresh headlines' compact inverted size='tiny' style={{'color':'darkorchid', 'paddingRight':'3px'}} onClick={() => props.refreshHeadlines()}/>
        </span>
      </Header>
      <Table celled compact sortable striped style={{marginTop:0}}>
        <Table.Body>{listHeadlines()}</Table.Body>
        </Table>
    </span>
  );
}

export default Headlines;
