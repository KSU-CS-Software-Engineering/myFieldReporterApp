import React, {Component} from 'react';
import './fields.css';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';

export default class fields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field: '',
            crop: '',
            location: '',
            view: 'current'
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleView = this.toggleView.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleCreate(){
        var fid = firebase.database().ref('fields/').push().key;
        var uid = firebase.auth().currentUser.uid;
        var updates = {}
        updates['fields/' + fid] = {
            field: this.state.field,
            crop: this.state.crop,
            location: this.state.location,
            owner: uid
          }
        updates['users/' + uid + /fields/ + fid] = true;
        firebase.database().ref().update(updates).catch(err => console.error(err));
            this.toggleView();
        
        
    }
        
    toggleView(){
        this.setState({view:(this.state.view== 'newField')?'current':'newField'})
    }

    render() {
            if(this.state.view == 'current'){
                return (
                    <div className="container">
            
                        <button onClick={this.toggleView}>Create Field</button>
                       
                        <h1>Your Fields</h1>
                    </div>
                );
            }
            else
                {
                    return(
                        <div className="container">
                            <h1>New Field</h1>
                            <input placeholder="Name of Field" name="field" value={this.state.field} onChange={this.handleChange} required />
                            <br/>
                            <input placeholder="Crop in Field" name="crop" value={this.state.crop} onChange={this.handleChange} required />
                            <br/>
                            <input placeholder="Location" name="location" value={this.state.location} onChange={this.handleChange} required />
                            <br/>
                            <button onClick={this.handleCreate}>Submit</button>
                            
                            <br/>
                            <br/>
                            {this.state.message}

                    <Link to="/">Dashboard</Link>
                        </div>

                    )
                }
    }
    
}