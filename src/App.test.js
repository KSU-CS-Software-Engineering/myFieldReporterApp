import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as firebase from 'firebase';

export default class SelectCrop extends Component {
    constructor(props) {
        super(props);
        this.state = {crops: []}
    }
    componentWillMount(){
        firebase.database().ref('crops').once('value', (snapshot) => {
           this.setState({crops: snapshot.val()}); 
        });
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

/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
*/