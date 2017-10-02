import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Auth from './components/auth/auth';
import * as firebase from 'firebase';
import Fields from './components/fields/fields';

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
            </div>
            <p className="App-intro">
                
                <button >New Report</button>
                </p><p>
                <button >View Fields</button>
                </p>
                
         
                <a href='' onClick={this.handleLogOut}>Log Out</a>
           
        </Auth>
      </div>
    );
  }
}

export default App;
