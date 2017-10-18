import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Auth from './components/auth/auth';
import * as firebase from 'firebase';
import Reports from './components/reports/reports';

class App extends Component {
    handleLogOut(event){
        firebase.auth().signOut().then(function(){
            //LogoutSuccessful
        }, function(error){
            //Error  
        });
    }
    handleReport(){
        <Reports></Reports>
    }
  render() {
    return (
      <Router>
        <div className="App">
            <div className="App-header">
                <a href="/" className="App">
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
            </div>
            <Auth>
                <Switch>
                    <Route path="/reports" render={()=>(
                        <Reports />
                    )}/>
                    <Route path="/" render={()=>(
                        <div>
                            <Reports></Reports>
                        </div>
                    )}/>
                </Switch>

                <a href='' onClick={this.handleLogOut}>Log Out</a>

            </Auth>
          </div>
        </Router>

    );
  }
}

export default App;
