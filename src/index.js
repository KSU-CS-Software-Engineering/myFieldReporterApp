import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
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


firebase.firestore().enablePersistence()
  .then(function() {
      // Initialize Cloud Firestore through firebase
      var db = firebase.firestore();
  })
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });


window.firebase



ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
