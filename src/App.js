import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import {Link} from 'react-router-dom';
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
    handleFields(){
        <Fields></Fields>
    }
  render() {
    return (
      <div className="App">
        <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
        </div>
            
        <Auth>
            <p className="App-intro">
                
                <button >New Report</button>
                </p><p>
                <Link to="/fields">View Fields</Link>
            </p>
                
         
            <a href='' onClick={this.handleLogOut}>Log Out</a>
           
        </Auth>
      </div>
    );
  }
}

export default App;
