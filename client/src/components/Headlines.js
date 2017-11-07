import React from 'react';
import {Button, Grid, Header} from 'semantic-ui-react';

const Headlines = (props) => {
  const {articles} = props;

  function listHeadlines() {
    if (articles) {
      return articles.map((article,index) => {
        return (
          <Grid.Row key={index} style={{margin: 0, padding: '3px'}}>
            <Grid.Column>
              <a href={article.url} title={article.description} target='_blank' rel='noopener noreferrer'><span style={{fontWeight:article.fontWeight}}>{article.title}.</span></a>
            </Grid.Column>
          </Grid.Row>
        );
      });
    } else {
      return null;
    }
  }

  return (
    <div>
      <Grid.Row style={{margin: 0, padding: '3px'}}>
        <Grid.Column>
          <Header size='medium' color='purple' style={{marginBottom:0, marginLeft:'4px'}}>
            Headline News
            <span style={{float:'right'}}>
              <Button disabled content='Refresh: 1 min' icon='refresh' title='Refresh headlines' size='tiny' inverted compact style={{'color':'darkorchid', 'paddingLeft':'5px'}} onClick={() => props.refreshHeadlines()}/>
            </span>
          </Header>
        </Grid.Column>
      </Grid.Row>
      {listHeadlines()}
    </div>
  );
}

export default Headlines;
