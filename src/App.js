import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Auth from './components/auth/auth';
import * as firebase from 'firebase';

class App extends Component {
    handleLogOut(event){
        firebase.auth().signOut().then(function(){
            //LogoutSuccessful
        }, function(error){
            //Error  
        });
    }
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
                <a onClick={this.handleLogOut}>Log Out</a>
           
        </Auth>
      </div>
    );
  }
}

export default App;
