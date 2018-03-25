import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Decimal from '../classes/Decimal';
import Fmt from '../utils/formatter';
import {Headlines} from '../components/Headlines';
import * as Request from '../utils/request';

class HeadlinesPage extends Component {

  static HEADLINES_REFRESH_INTERVAL = 300 * 1000;  // in milliseconds.
  static INDEXES_REFRESH_INTERVAL   =  60 * 1000;  // in milliseconds.

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      djiaValue:  new Decimal(0.0, 'index'),
      djiaChange: new Decimal(0.0, 'index', 'delta'),
      headlinesIntervalId: -1,
      indexesIntervalId: -1,
      refreshTime: new Date(),
    }
  }

  componentDidMount() {
    this.refreshHeadlines();
    this.setState({headlinesIntervalId: window.setInterval(this.refreshHeadlines, HeadlinesPage.HEADLINES_REFRESH_INTERVAL)});
    this.setState({indexesIntervalId: window.setInterval(this.refreshIndexes,   HeadlinesPage.INDEXES_REFRESH_INTERVAL)});
  }

  componentWillUnmount(){
    window.clearInterval(this.state.headlinesIntervalId);
    window.clearInterval(this.state.indexesIntervalId);
  }

  refreshHeadlines = () => {
    Request.headlinesRefresh(headlines => {
      if (headlines.status === 'error') {
        alert(Fmt.serverError('Refresh Headlines', headlines.message));
      } else {
        headlines.articles.forEach((headlinesArticle,index) => {
          if ((index > this.state.articles.length-1) || (headlinesArticle.title !== this.state.articles[index].title)) {
            headlinesArticle.fontWeight = 'bold';
          } else {
            headlinesArticle.fontWeight = 'normal';
          }
        });
        this.setState({articles: headlines.articles});
      }
    });
  }

  refreshIndexes = () => {
    Request.indexesRefresh(indices => {
      if ('error' in indices) {
        alert(Fmt.serverError('Refresh Indexes', indices.error));
      } else {
        const djia = indices.data.find(indice => indice.attributes.instrument.symbol === 'DJIA');
        if (djia) {
          this.setState({djiaValue: new Decimal(djia.attributes['trade-price'], 'index'), djiaChange: new Decimal(djia.attributes['price-change'], 'index', 'delta'), refreshTime: new Date()});
        }
      }
    });
  }

  render() {
    const {userLocale} = this.props;
    return (<Headlines articles={this.state.articles} djiaValue={this.state.djiaValue} djiaChange={this.state.djiaChange} refreshTime={this.state.refreshTime} refreshHeadlines={this.refreshHeadlines} userLocale={userLocale}/>);
  }
}

HeadlinesPage.propTypes = {
  userLocale: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {userLocale: state.users.user.locale};
}

export default connect(mapStateToProps)(HeadlinesPage);
