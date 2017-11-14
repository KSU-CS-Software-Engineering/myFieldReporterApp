import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Auth from './components/auth/auth';
import * as firebase from 'firebase';
import Reports from './components/reports/reports';
import './opensans/stylesheet.css';
import Dashboard from './components/dashboard/dashboard';
import ShowReport from './components/showReport/showReport';
import EditReport from './components/editReport/editReport';

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
                <a href="/">
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
            </div>
            <Auth>
                <Switch>
                    <Route path="/reports/:reportID/edit" render={({match})=>(
                        <EditReport reportID={match.params.reportID}/>
                    )}/>
                    <Route path="/reports/:reportID" render={({match})=>(
                        <ShowReport reportID={match.params.reportID}/>
                    )}/>
                    <Route path="/reports" render={()=>(
                        <Reports/>
                    )}/>
                    <Route path="/" render={()=>(
                        <Dashboard />
                    )}/>
                </Switch>
                
                <div className="log-container">
                    <a href='' id="log-out" onClick={this.handleLogOut}>Log Out</a>
                </div>

            </Auth>
          </div>
        </Router>

    );
  }
}

export default App;
