import React, {Component} from 'react';
import './auth.css';
import * as firebase from 'firebase';

export default class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {user: null}
    }
    
    componentWillMount(){ 
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({user:user})
        })
   }
    
    render() {
        if(this.state.user) {
            return (<div>{this.props.children}</div>);
        } else {
            return (<h1>Login Form!</h1>);
        }
    }
}
                    