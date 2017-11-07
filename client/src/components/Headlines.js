import React from 'react';
import {Button, Grid, Header, Table} from 'semantic-ui-react';

const Headlines = (props) => {
  const {articles} = props;

  function listHeadlines() {
    if (articles) {
      return articles.map((article,index) => {
        return (
          <Grid.Row key={index} style={{margin: 0, padding: '3px'}}>
            <a href={article.url} title={article.description} target='_blank' rel='noopener noreferrer'>{article.title}</a>
          </Grid.Row>
        );
      });
    } else {
      return null;
    }
  }

  return (
    <div>
      <Header content='Headline News' size='medium' color='purple'></Header>
      <Button content='Refresh' icon='refresh' title='Refresh headlines' /*loading={updatingPortfolio}*/ size='tiny' inverted compact style={{'color':'darkorchid', 'paddingLeft':'5px'}} onClick={() => props.refreshHeadlines()}/>
      <span style={{float:'right'}}>powered by <a href='https://newsapi.org' target='_blank' rel='noopener noreferrer'>NewsAPI.org</a></span>
      <Grid padded style={{margin: 0, padding: 0}}>
        {listHeadlines()}
      </Grid>
    </div>
  );
}

export default Headlines;
