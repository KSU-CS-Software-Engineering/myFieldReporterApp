import React, {Component} from 'react';
import './auth.css';

export default class Auth extends Component {
    constructor(props){
        super(props);
        this.state = {user: null}
    }
    render() {
        if(this.state.  user) {
            return (<div>{this.props.children}</div>);
        } else {
            return (<h1>Login Form!</h1>);
        }
    }
} 