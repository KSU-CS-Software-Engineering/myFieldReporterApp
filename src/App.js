import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Auth from './components/auth/auth';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Auth>
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
              To get <b>started,</b>, edit <code>src/App.js!!!!!!!!!!!!!</code> and save to reload.
            </p>
        </Auth>
      </div>
    );
  }
}

export default App;
