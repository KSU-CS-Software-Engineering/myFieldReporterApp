//this is the component that the "auth" component renders when a user is not authorized

import React, {Component} from 'react';
import './login-form.css';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        console.log(this.state)
    }
    render() {
        return (
            <div className="container">
                <h1>Login</h1>
                <form>
                    <label><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.handleChange} required />

                    <label><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} required />

                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
} 