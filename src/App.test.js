import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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


/*
export default class SelectCrop extends Component {
    constShow
    }
    render() {
        var list = this.state.crops.map((crop) => {
            return <li key={crop.name}>{crop.name}</li>
        });
        return (
            <ul>
                {list}
            </ul>
        )
    }
}
*/


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
