import React, {Component} from 'react';
import './auth.css';
import * as firebase from 'firebase';
import LoginForm from '../login-form/login-form'

export default class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {
            user: null
                     }
    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({user:user});
            console.log("Change" + this.state.user.uid);
        })
    }

    render() {
        if(this.state.user) {
            return (<div>{this.props.children}</div>);
        } else {
            return (<LoginForm></LoginForm>);
        }
    }
}
