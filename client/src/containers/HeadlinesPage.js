import React, {Component} from 'react';
import * as ActionUtils from '../actions/actionUtils';
import Headlines from '../components/Headlines';

export default class HeadlinesPage extends Component {

  static HEADLINES_REFRESH_INTERVAL = 60 * 1000;

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      djia: {price: '', change: ''},
      intervalId: -1,
      refreshTime: new Date(),
    }
  }

  componentDidMount() {
    this.refreshHeadlines();
    this.setState({intervalID: window.setInterval(this.refreshHeadlines, HeadlinesPage.HEADLINES_REFRESH_INTERVAL)});
  }

  componentWillUnmount(){
    window.clearInterval(this.state.intervalId);
  }

  refreshHeadlines = () => {
    ActionUtils.refreshHeadlines(headlines => {
      if (headlines !== null) {
        headlines.articles.forEach((article,index) => {
          if ((index >= this.state.articles) || (article.title !== this.state.articles[index].title)) {
            article.fontWeight = 'bold';
          } else {
            article.fontWeight = 'normal';
          }
        });
        this.setState({articles: headlines.articles, refreshTime: new Date()});
      }
    });
    ActionUtils.refreshIndexes(indices => {
      if (indices !== null) {
        indices.some((indice,index) => {
          let isDJIA = indice.stock_symbol.name === 'DJIA';
          if (isDJIA) {
            this.setState({djia: {price: indice.trade_price, change: indice.price_change}});
          }
          return isDJIA;
        });
      }
    });
  }

  render() {
    return (<Headlines articles={this.state.articles} djia={this.state.djia} refreshTime={this.state.refreshTime} refreshHeadlines={this.refreshHeadlines}/>);
  }
}
