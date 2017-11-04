import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Header extends Component {
  render () {
    return (
      <header className="App-header">
        <img src={this.props.logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Stutter.IO</h1>
      </header>
    )
  }
}

export default Header;
