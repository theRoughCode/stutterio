import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header'
import Body from './Body';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header
          logo={logo}
          />
        <Body />
      </div>
    );
  }
}

export default App;
