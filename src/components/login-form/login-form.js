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
        this.handlefbCreate = this.handlefbCreate.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFP = this.handleFP.bind(this);
        this.handlefbFP = this.handlefbFP.bind(this);

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

//USE FOR FIREBASE LOGIN CHANGE ON LINE 235
    handleFbSignin(){
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((err) => {
             this.setState({message: err.message});
         });
    }



    SignInWork(){
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


            this.setState({
                fName: 'first',//us['firstName'], SET
                lName: 'last',//us['lastName'], SET
                email: us['email'],
                state: us['state'],
                county: us['county'],
                uid: us['uid']
            })
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

//USE FOR DRUPAL LOGIN CHANGE ON LINE 235
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


            this.setState({
                fName: us['firstName'].und['0'].value,
                lName: us['lastName'].und['0'].value,
                email: us['email'],
                state: us['state'].und['0'].value,
                uid: us['uid']
            })
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

  //USE FOR FIREBASE create user CHANGE ON LINE 311
    handlefbCreate() {
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

//USE FOR DRUPAL create user CHANGE ON LINE 311
    handleCreate(){
      $.ajax({
        beforeSend: function(request) {
            //request.setRequestHeader("Authority", 'yes');
        },
        type: 'POST',
        url: 'http://localhost:8888/Drupal/ajax/create.json', //SET
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


//USE FOR DRUPAL Forgot Password CHANGE ON LINE 237
    handleFP(){
      $.ajax({
        beforeSend: function(request) {
            //request.setRequestHeader("Authority", 'yes');
        },
        type: 'POST',
        url: 'http://localhost:8888/Drupal/ajax/forgotpass.json', //SET
        data: { 'email': this.state.email},
        success: function(response) {
          response = response.substr(1).slice(0, -1);
          console.log(response);
          try{
             this.setState({message: response});
          }catch(err){
              console.log(err);
              return;
          }

        }.bind(this),
        fail: function(response){

        }

      });

    }

//USE FOR FIREBASE Forgot Password CHANGE ON LINE 237
    handlefbFP(){
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
                    <button onClick={this.handleSignin}>Login</button>
                    <button onClick={this.toggleView}>New User</button>
                    <a onClick={this.handleFP}>Forgot Password?</a>
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
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="District Of Columbia">District Of Columbia</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                                <option value="Louisiana">Louisiana</option>
                                <option value="Maine">Maine</option>
                                <option value="Maryland">Maryland</option>
                                <option value="Massachusetts">Massachusetts</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Minnesota">Minnesota</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="Missouri">Missouri</option>
                                <option value="Montana">Montana</option>
                                <option value="Nebraska">Nebraska</option>
                                <option value="Nevada">Nevada</option>
                                <option value="New Hampshire">New Hampshire</option>
                                <option value="New Jersey">New Jersey</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="New York">New York</option>
                                <option value="North Carolina">North Carolina</option>
                                <option value="North Dakota">North Dakota</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Oklahoma">Oklahoma</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Pennsylvania">Pennsylvania</option>
                                <option value="Rhode Island">Rhode Island</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="South Dakota">South Dakota</option>
                                <option value="Tennessee">Tennessee</option>
                                <option value="Texas">Texas</option>
                                <option value="Utah">Utah</option>
                                <option value="Vermont">Vermont</option>
                                <option value="Virginia">Virginia</option>
                                <option value="Washington">Washington</option>
                                <option value="West Virginia">West Virginia</option>
                                <option value="Wisconsin">Wisconsin</option>
                                <option value="Wyoming">Wyoming</option></select>
                            <input className="fourth-line" placeholder="County" name="county" value={this.state.county} onChange={this.handleChange} required />
                            <div className="name-icon first-icon"></div>
                            <div className="email-icon second-icon"></div>
                            <div className="password-icon third-icon"></div>
                        </div>
                        <button onClick={this.handleCreate}>Submit</button>

                        <a onClick={this.toggleView}>Already have an account? Sign In</a>
                        <div className="grass"></div>
                    </div>
                )
            }
    }
}
