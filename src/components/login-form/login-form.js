//this is the component that the "auth" component renders when a user is not authorized

import React, {Component} from 'react';
import './login-form.css';
import * as firebase from 'firebase';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSignIn() {
       console.log("HERE");
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).catch((err) => {
            this.setState({message: err.message});
        })
        console.log(this.state)
    }
    render() {
        return (
            <div className="container">
                <h1>Login</h1>
            {this.state.message}
               
                    <label><b>Email</b></label>
                    <input type="email" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.handleChange} required />

                    <label><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} required />

                    <button onClick={this.handleSignIn}>Login</button>
              
            </div>
        );
    }
} 