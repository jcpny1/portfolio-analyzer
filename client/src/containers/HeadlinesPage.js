import React, {Component} from 'react';
import * as ActionUtils from '../actions/actionUtils';
import Headlines from '../components/Headlines';

export default class HeadlinesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
    }
  }

  componentDidMount() {
    this.refreshHeadlines();
  }

  refreshHeadlines = () => {
    ActionUtils.refreshHeadlines(headlines => {
      if (headlines !== null) {
        this.setState({articles: headlines.articles});
      }
    });
  }

  render() {
    return (<Headlines articles={this.state.articles}/>);
  }
}
