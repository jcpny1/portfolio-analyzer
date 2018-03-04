import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const Headlines = (props) => {
  const {articles, djiaValue, djiaChange, refreshHeadlines, refreshTime, userLocale} = props;

  function listHeadlines() {
    if (articles) {
      return articles.map((article,index) => {
        return (
          <Table.Row key={index}>
            <Table.Cell>
              <a className='news' href={article.url} title={article.description} target='_blank' rel='noopener noreferrer'><span style={{fontWeight:article.fontWeight}}>{article.title}.</span></a>
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
        <span disabled style={{float:'right', fontSize:'70%'}}>
          <Header as='span' title='Dow Jones Industrial Average' size='tiny' color='purple'>
            {djiaValue.toHTML(userLocale, 'purple')}&nbsp;{djiaChange.toHTML(userLocale)}
          </Header>
          &emsp;&emsp;
          <Header as='span' content={refreshTime.toLocaleTimeString("en-US")} title='Last refresh time' size='tiny' color='purple'/>
          &emsp;&emsp;
          <Button disabled content='Refresh: 2 min' icon='refresh' title='Refresh headlines' compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => refreshHeadlines()}/>
        </span>
      </Header>
      <Table compact sortable striped style={{marginTop:0}}>
        <Table.Body>{listHeadlines()}</Table.Body>
        </Table>
    </span>
  );
}

Headlines.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  djiaValue: PropTypes.object.isRequired,
  djiaChange: PropTypes.object.isRequired,
  refreshHeadlines: PropTypes.func.isRequired,
  refreshTime: PropTypes.instanceOf(Date).isRequired,
  userLocale: PropTypes.string.isRequired,
}
