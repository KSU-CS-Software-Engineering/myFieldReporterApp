// login-form.test.js
import React from 'react';
import LoginForm from './login-form';
import renderer from 'react-test-renderer';
import * as firebase from 'firebase';
import FirebaseServer from 'firebase-server';

 
  var config = {
      apiKey: "AIzaSyAHaFwzXQfOCzLRc61T7buHYtfMucIkwF8",
      authDomain: "myfields-researcher.firebaseapp.com",
      databaseURL: "test.firebase.localhost:5000",
      projectId: "myfields-researcher",
      storageBucket: "myfields-researcher.appspot.com",
      messagingSenderId: "545497609582"
  };
  firebase.initializeApp(config);

test('Renders a login form', () => {
  const component = renderer.create(
    <LoginForm />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});