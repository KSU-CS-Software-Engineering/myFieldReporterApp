//this is the component that the "auth" component renders when a user is not authorized

import React, {Component} from 'react';
import './login-form.css';
import * as firebase from 'firebase';
import $ from 'jquery';


export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fName: '',
            lName: '',
            state: '',
            county: '',
            message: '',
            view: 'login'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleFbSignin = this.handleFbSignin.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleFbCreate = this.handleFbCreate.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFP = this.handleFP.bind(this);
        this.handleFbFP = this.handleFbFP.bind(this);

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

//USE FOR FIREBASE LOGIN CHANGE ON LINE 306
    handleFbSignin(){
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((err) => {
             this.setState({message: err.message});
         });
    }


//USE FOR DRUPAL LOGIN CHANGE ON LINE 306
    handleSignIn() {
      console.log("at signin");
      $.ajax({
        beforeSend: function(request) {
            //request.setRequestHeader("Authority", 'yes');
        },
        type: 'POST',
        url: 'http://localhost:8888/Drupal/ajax/login.json', //SET
        data: { 'email': this.state.email, 'password':this.state.password },
        success: function(response) {
          try{
            var base64Url = response.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            var us = JSON.parse(window.atob(base64));
          }catch(err){
              this.setState({
                message : response
              })
              return;
          }


            if(us['firstName'].und['0'].value){
              this.setState({
                  fName: us['firstName'].und['0'].value,
                  lName: us['lastName'].und['0'].value,
                  email: us['email'],
                  state: us['state'].und['0'].value,
                  uid: us['uid']
              })
            }else{
              this.setState({
                fName: 'First',
                lName: 'Last',
                email: us['email'],
                state: 'State',
                uid: us['uid']
              })
            }
            console.log(this.state.email);

            firebase.auth().signInWithCustomToken(response).then( function(user) {
                return user.updateEmail(this.state.email);
              }.bind(this)).catch(function(error) {
              // Handle Errors here.
              console.log(error.code + " " + error.message);
              // ...
            }).then(function(){

            firebase.database().ref('users/').once('value' , function(snapshot){
              console.log(snapshot);
              if(!snapshot.hasChild(us['uid'])) {
                  console.log(this.state.email);
                  firebase.database().ref('users/').child(this.state.uid).set({
                    email: this.state.email,
                    fName: this.state.fName,
                    lName: this.state.lName
                    //state: this.state.state,
                    //county: this.state.county,
                  }).catch(err => console.error(err));
                }
            }.bind(this))
            console.log(this.state.email);
          }.bind(this));

          console.log(this.state.email);

        }.bind(this),
        fail: function(response){
          console.log(response);
        }

      });

    }

  //USE FOR FIREBASE create user CHANGE ON LINE 382
    handleFbCreate() {
        // Helper function to write created user to the database

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((firebaseUser) => {
            console.log('created user', firebaseUser.uid, firebaseUser)
            //writeUserData(firebaseUser.uid, firebaseUser.email,this.state.fName,this.state.lName,this.state.state,this.state.county);
        })
        .catch((err) => {
            this.setState({message: err.message});
        })


    }

    showme(){
        var x = document.getElementById("myFrame").src;
        console.log(x);
    }

//USE FOR DRUPAL create user CHANGE ON LINE 382
    handleCreate(){
      $.ajax({
        beforeSend: function(request) {
            //request.setRequestHeader("Authority", 'yes');
        },
        type: 'POST',
        url: 'http://localhost:8888/Drupal/ajax/create', //SET
        data: { 'email': this.state.email, 'password': this.state.password, 'firstName':this.state.fName, 'lastName':this.state.lName, 'state':this.state.state},
        success: function (response) {
          console.log(response);

          $.ajax({
            beforeSend: function(request) {
                //request.setRequestHeader("Authority", 'yes');
            },
            type: 'POST',
            url: 'http://localhost:8888/Drupal/ajax/login.json', //SET
            data: { 'email': this.state.email, 'password':this.state.password },
            success: function(response) {

              try{
                var base64Url = response.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                var us = JSON.parse(window.atob(base64));
              }catch(err){
                  this.setState({
                    message : response
                  })
                  return;
              }
                var setUID = JSON.stringify(us['uid']);
                setUID = setUID.substr(1).slice(0, -1);

                console.log(setUID);



                firebase.auth().signInWithCustomToken(response).then( function(user) {
                    return user.updateEmail(this.state.email);
                  }.bind(this)).catch(function(error) {
                  // Handle Errors here.
                  console.log(error.code + " " + error.message);
                  // ...
                }).then(function(){

                firebase.database().ref('users/').once('value' , function(snapshot){
                  console.log(snapshot);
                  if(!snapshot.hasChild(setUID)) {
                      console.log(this.state.email);
                      firebase.database().ref('users/').child(setUID).set({
                        email: this.state.email,
                        fName: this.state.fName,
                        lName: this.state.lName
                        //state: this.state.state,
                        //county: this.state.county,
                      }).catch(err => console.error(err));
                    }
                }.bind(this))
                console.log(this.state.email);
              }.bind(this));

              console.log(this.state.email);

            }.bind(this),
            fail: function(response){
              console.log(response);
            }

          });

          try{
             this.setState({message: response});
          }catch(err){
              console.log(err);
              return;
          }

        }.bind(this),
        fail: function(response){
              console.log(response);
        }

      });

    }


//USE FOR DRUPAL Forgot Password CHANGE ON LINE 308
    handleFP(){
      $.ajax({
        beforeSend: function(request) {
            //request.setRequestHeader("Authority", 'yes');
        },
        type: 'POST',
        url: 'http://localhost:8888/Drupal/ajax/forgotPass?name='+this.state.email, //SET
        data: { 'email': this.state.email},
        success: function(response) {
          //response = response.substr(1).slice(0, -1);
          console.log(response);
          try{
             this.setState({message: response});
          }catch(err){
              console.log(err);
              return;
          }

        }.bind(this),
        fail: function(response){
            this.setState({message: response});
        }

      });

    }

//USE FOR FIREBASE Forgot Password CHANGE ON LINE 308
    handleFbFP(){
        var auth = firebase.auth();
        var emailAddress = this.state.email;

        auth.sendPasswordResetEmail(emailAddress).then(function() {

          alert("Email has been sent");
        }).catch(function(error) {
             console.log(emailAddress);
            if(emailAddress == ""){
                alert("Please enter Email adress");
            }
          switch(error.code){
              case "auth/user-not-found":
                  alert("Email account was not found");
                  break;
                              }

        });
    }

    toggleView(){
        this.state.message = "";
        this.setState({view:(this.state.view== 'signup')?'login':'signup'})
    }

    render() {
        if(this.state.view == 'login'){
            return (
                <div className="login-form-container">
                    <h1>Login</h1>
                    <div className="message">{this.state.message}</div>
                    <div id="login-container">
                        <input className="first-line" type="email" placeholder="Email Address" name="email" value={this.state.email} onChange={this.handleChange} required />
                        <input className="second-line" type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} required />
                        <div className="email-icon first-icon"></div>
                        <div className="password-icon second-icon"></div>
                    </div>
                    <button onClick={this.handleFbSignin}>Login</button>
                    <button onClick={this.toggleView}>New User</button>
                    <a onClick={this.handlefbFP}>Forgot Password?</a>
                    <div className="grass"></div>
                </div>
            );
        }
        else
            {
                return(
                    <div className="login-form-container">
                        <h1>Signup</h1>
                        <div className="message">{this.state.message}</div>
                        <div id="signup-container">
                            <input className="first-line" placeholder="First Name" name="fName" value={this.state.fName} onChange={this.handleChange} required />
                            <input className="first-line" placeholder="Last Name" name="lName" value={this.state.lName} onChange={this.handleChange} required />
                            <input className="second-line" type="email" placeholder="Email Address" name="email" value={this.state.email} onChange={this.handleChange} required />
                            <input className="third-line" type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} onKeyPress={this.handleKeyPress} required />
                            <select className="fourth-line" name="state" required onChange={this.handleChange}>
                                <option value="" selected disabled hidden>State</option>
                                <option value="AL">Alabama</option>
-                                <option value="AK">Alaska</option>
-                                <option value="AZ">Arizona</option>
-                                <option value="AR">Arkansas</option>
-                                <option value="CA">California</option>
-                                <option value="CO">Colorado</option>
-                                <option value="CT">Connecticut</option>
-                                <option value="DE">Delaware</option>
-                                <option value="DC">District Of Columbia</option>
-                                <option value="FL">Florida</option>
-                                <option value="GA">Georgia</option>
-                                <option value="HI">Hawaii</option>
-                                <option value="ID">Idaho</option>
-                                <option value="IL">Illinois</option>
-                                <option value="IN">Indiana</option>
-                                <option value="IA">Iowa</option>
-                                <option value="KS">Kansas</option>
-                                <option value="KY">Kentucky</option>
-                                <option value="LA">Louisiana</option>
-                                <option value="ME">Maine</option>
-                                <option value="MD">Maryland</option>
-                                <option value="MA">Massachusetts</option>
-                                <option value="MI">Michigan</option>
-                                <option value="MN">Minnesota</option>
-                                <option value="MS">Mississippi</option>
-                                <option value="MO">Missouri</option>
-                                <option value="MT">Montana</option>
-                                <option value="NE">Nebraska</option>
-                                <option value="NV">Nevada</option>
-                                <option value="NH">New Hampshire</option>
-                                <option value="NJ">New Jersey</option>
-                                <option value="NM">New Mexico</option>
-                                <option value="NY">New York</option>
-                                <option value="NC">North Carolina</option>
-                                <option value="ND">North Dakota</option>
-                                <option value="OH">Ohio</option>
-                                <option value="OK">Oklahoma</option>
-                                <option value="OR">Oregon</option>
-                                <option value="PA">Pennsylvania</option>
-                                <option value="RI">Rhode Island</option>
-                                <option value="SC">South Carolina</option>
-                                <option value="SD">South Dakota</option>
-                                <option value="TN">Tennessee</option>
-                                <option value="TX">Texas</option>
-                                <option value="UT">Utah</option>
-                                <option value="VT">Vermont</option>
-                                <option value="VA">Virginia</option>
-                                <option value="WA">Washington</option>
-                                <option value="WV">West Virginia</option>
-                                <option value="WI">Wisconsin</option>
-                                <option value="WY">Wyoming</option></select>
                            <input className="fourth-line" placeholder="County" name="county" value={this.state.county} onChange={this.handleChange} required />
                            <div className="name-icon first-icon"></div>
                            <div className="email-icon second-icon"></div>
                            <div className="password-icon third-icon"></div>
                        </div>
                        <button onClick={this.handlefbCreate}>Submit</button>

                        <a onClick={this.toggleView}>Already have an account? Sign In</a>
                        <div className="grass"></div>
                    </div>
                )
            }
    }
}
