//this is the component that the "auth" component renders when a user is not authorized

import React, {Component} from 'react';
import './login-form.css';
import * as firebase from 'firebase';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            view: 'login'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.toggleView = this.toggleView.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSignIn() {
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).catch((err) => {
            this.setState({message: err.message});
        })
    }
    handleCreate() {
        
        firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password).catch((err) => { 
            this.setState({message: err.message});
        })
        
    }
    toggleView(){
        this.setState({view:(this.state.view== 'signup')?'login':'signup'})
    }
    render() {
        if(this.state.view == 'login'){
            return (
                <div className="container">
                    <h1>Login</h1>
                    <input type="email" placeholder="Email Address" name="username" value={this.state.username} onChange={this.handleChange} required />
                    <br/>
                    <input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} required />
                    <br/>
                    <button onClick={this.handleSignIn}>Login</button>
                    <button onClick={this.toggleView}>New User</button>
                    <br/>
                    <a>Forgot Password?</a>
                    <br/>
                    {this.state.message}
                </div>
            );
        }
        else
            {
                return(
                    <div className="container">
                        <h1>Signup</h1>
                        <input type="email" placeholder="Email Address" name="username" value={this.state.username} onChange={this.handleChange} required />
                        <br/>
                        <input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} required />
                        <br/>
                        <button onClick={this.handleCreate}>Submit</button>
                        <br/>
                        <a onClick={this.toggleView}>Already have an account? Sign In</a>
                        <br/>
                        <br/>
                        {this.state.message}
                    </div>
                )
            }
    }
} 