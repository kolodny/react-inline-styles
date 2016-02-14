import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
global.React = React;
global.ReactDOM = ReactDOM;

import reactInlineStyles from '../..';

const style = {
  color: 'red',
  ':hover': {
    color: 'red',
    background: 'blue',
  },
};

class App extends Component {
  componentDidMount() {
    // console.log(this.refs.foobar)
  }
  render() {
    return (
      <div>
        <span></span>
        <span>
          <span style={style}>Hover over me!</span>
          {
            /*
              [
                <span style={style}>Hover over me!</span>,
                <span style={style}>Hover over me!</span>
              ]
            */
          }
        </span>
      </div>
    );
  }
}

App = reactInlineStyles(App);



const AppRendered = <span><App /></span>;
const root = document.getElementById('root');

render(AppRendered, root);
