import React, {Component} from 'react';
import * as ActionUtils from '../actions/actionUtils';
import Headlines from '../components/Headlines';

export default class HeadlinesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      intervalId: -1,
    }
  }

  componentDidMount() {
    this.refreshHeadlines();
    this.setState({intervalID: window.setInterval(this.refreshHeadlines, 60000)});
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
        this.setState({articles: headlines.articles});
      }
    });
  }

  render() {
    return (<Headlines articles={this.state.articles} refreshHeadlines={this.refreshHeadlines}/>);
  }
}
