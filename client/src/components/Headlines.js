import React from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Fmt from '../utils/formatters';

export const Headlines = (props) => {
  const {articles, djia, refreshTime} = props;

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
        <span disabled style={{float:'right', fontSize:'70%'}}>
          <Button content={Fmt.index('DJIA', djia)} title='Dow Jones Industrial Average' size='tiny' inverted compact/>
          &emsp;&emsp;
          <Button content={refreshTime.toLocaleTimeString("en-US")} title='Refresh time' size='tiny' inverted compact/>
          &emsp;&emsp;
          <Button disabled content='Refresh: 1 min' icon='refresh' title='Refresh headlines' compact inverted size='tiny' style={{paddingRight:'3px'}} onClick={() => props.refreshHeadlines()}/>
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
  djia: PropTypes.shape({
    price: PropTypes.string.isRequired,
    change: PropTypes.string.isRequired,
  }),
  refreshTime: PropTypes.instanceOf(Date).isRequired,
}
