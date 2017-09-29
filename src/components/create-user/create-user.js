//this is the component that the "login-form" component renders when New User is clicked

import React, {Component} from 'react';
import './create-user.css';
import * as firebase from 'firebase';

export default class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleCreate() {
        firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password).catch((err) => {
            this.setState({message: err.message});
        })
    }
    render() {
        return (
            <div className="container">
                <h1>New User</h1>
            {this.state.message}
               
                    <label><b>Email</b></label>
                    <input type="email" placeholder="Enter Email" name="Email" value={this.state.username} onChange={this.handleChange} required />

                    <label><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} required />

                    <button onClick={this.handleCreate}>Create User</button>
            
              
            </div>
        );
    }
} 