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
            fName: '',
            lName: '',
            state: '',
            county: '',
            view: 'login'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFP = this.handleFP.bind(this);
        
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleKeyPress(event) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if(code == 13) {
            this.handleSignIn();
        }
    }
    handleSignIn() {
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).catch((err) => {
            this.setState({message: err.message});
        })
    }
    handleCreate() {
        // Helper function to write created user to the database
        function writeUserData(userId, email,first,last,state,county) {
          firebase.database().ref('users/').child(userId).set({
            email: email,
            fName: first,
            lName: last,
            state: state,
            county: county,
          }).catch(err => console.error(err));
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password)
        .then((firebaseUser) => {
            console.log('created user', firebaseUser.uid, firebaseUser)
            writeUserData(firebaseUser.uid, firebaseUser.email,this.state.fName,this.state.lName,this.state.state,this.state.county);
        })
        .catch((err) => { 
            this.setState({message: err.message});
        })
        

    }
    
    handleFP(){
        var auth = firebase.auth();
        var emailAddress = this.state.username;
        
        auth.sendPasswordResetEmail(emailAddress).then(function() {
          alert("Email has been sent");
        }).catch(function(error) {
            
          switch(error.code){
              case "auth/user-not-found":
                  alert("Email account was not found");
                  break;
                              }
                    
        });
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
                    <input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} required />
                    <br/>
                    <button onClick={this.handleSignIn}>Login</button>
                    <button onClick={this.toggleView}>New User</button>
                    <br/>
                    <a onClick={this.handleFP}>Forgot Password?</a>
                    <br/>
                    {this.state.message}
                    <div className="grass"></div>
                </div>
            );
        }
        else
            {
                return(
                    <div className="container">
                        <h1>Signup</h1>
                        <input placeholder="First Name" name="fName" value={this.state.fName} onChange={this.handleChange} required />
                        <br/>
                        <input placeholder="Last Name" name="lName" value={this.state.lName} onChange={this.handleChange} required />
                        <br/>
                        <select name="state" required onChange={this.handleChange}>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option></select>
                        <br/>
                        <input placeholder="County" name="county" value={this.state.county} onChange={this.handleChange} required />
                        <br/>
                        <input type="email" placeholder="Email Address" name="username" value={this.state.username} onChange={this.handleChange} required />
                        <br/>
                        <input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} required />
                        <br/>
                        <button onClick={this.handleCreate}>Submit</button>
                        <br/>
                        <a onClick={this.toggleView}>Already have an account? Sign In</a>
                        <br/>
                        <br/>
                        {this.state.message}
                        <div className="grass"></div>
                    </div>
                )
            }
    }
} 