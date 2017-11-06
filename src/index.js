import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


var config = {
  apiKey: "AIzaSyAHaFwzXQfOCzLRc61T7buHYtfMucIkwF8",
  authDomain: "myfields-researcher.firebaseapp.com",
  databaseURL: "https://myfields-researcher.firebaseio.com",
  projectId: "myfields-researcher",
  storageBucket: "myfields-researcher.appspot.com",
  messagingSenderId: "545497609582"
};
firebase.initializeApp(config);

window.firebase 


ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
