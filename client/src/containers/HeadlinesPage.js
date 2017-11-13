import React, {Component} from 'react';
import * as Actions from '../utils/actions';
import Fmt from '../utils/formatters';
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
    Actions.refreshHeadlines(headlines => {
      if (headlines !== null) {
        headlines.articles.forEach((headlinesArticle,index) => {
          if ((index >= this.state.articles.length-1) || (headlinesArticle.title !== this.state.articles[index].title)) {
            headlinesArticle.fontWeight = 'bold';
          } else {
            headlinesArticle.fontWeight = 'normal';
          }
        });
        this.setState({articles: headlines.articles});
      }
    });
    Actions.refreshIndexes(indices => {
      if ('error' in indices) {
        alert(Fmt.serverError(indices.error, 'Refresh Indexes: '));
      } else {
        indices.some((indice,index) => {
          let isDJIA = indice.stock_symbol.name === 'DJIA';
          if (isDJIA) {
            this.setState({djia: {price: indice.trade_price, change: indice.price_change, refreshTime: new Date()}});
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
