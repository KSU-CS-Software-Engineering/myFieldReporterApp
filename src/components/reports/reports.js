import React, {Component} from 'react';
import './reports.css';
import Dashboard from '../dashboard/dashboard';
import CropSelect from '../Select/cropSelect';
import PestSelect from '../Select/pestSelect';
import GrowthStageSelect from '../Select/growthstageSelect';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import LocationInput from '../location-input/location-input';

export default class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: '',
            gs: '',
            location: {},
            images: [],
            pest: '',
            notes: '',
            list: [],
            reports: [],
            test: '',
            reportName: '',
            dist: '',
            sevr: '',
            distBorder: ["none", "none"],
            sevrBorder: ["none", "none", "none"],
            distPadding: ["10px 0", "10px 0"],
            sevrPadding: ["10px 0", "10px 0", "10px 0"]
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonSelection = this.handleButtonSelection.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.readFile = this.readFile.bind(this);

    }

    //Change state values with whatever was entered. if crop is the name, crop value will be changed.
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSelect(name, value){ //Change a specific state with a specific value. Used in searchableList
        this.setState({[name]: value});
    }

    //Creates the entry for the database from the state objects when submit is clicked
    handleCreate(){

        console.log(this.state.location.latitude);
        var valid = true;
        if(this.state.crop == ''){
            valid = false;
        }
        if(this.state.gs == ''){
            valid = false;
        }
        if(this.state.pest == ''){
            valid = false;
        }
        //currently not working**********
        if(this.state.location.latitude == 'undefined' || this.state.location.longitude == 'undefined'){
            valid = false;
        }
        if(this.state.dist == ''){
            valid = false;
        }
        if(this.state.sevr == ''){
            valid = false;
        }
        if(valid){
            var fid = firebase.database().ref('reports/').push().key;
            var photos = this.state.images;
            var uid = firebase.auth().currentUser.uid;
            var state = this.state;
            console.log(this.state);
            firebase.database().ref('users/' + uid).once('value').then((snapshot) => {
                console.log("uid " + uid);
                var user = snapshot.val();
                console.log(user.reports);
                var reportCount = 0;
                if(user.reports) reportCount = Object.keys(user.reports).length;

                 var rName= user.fName.concat(user.lName.concat(" " + (reportCount+1)));

                  var updates = {}
                  updates['reports/' + fid] = {
                        crop: state.crop,
                        location: state.location,
                        gs: state.gs,
                        pest: state.pest,
                        notes: state.notes,
                        time: new Date().toJSON(),
                        owner: uid,
                        name: rName,
                        dist: state.dist,
                        sevr: state.sevr
                      }
                    updates['users/' + uid + '/reports/' + fid + '/'] = true;
                console.log('updates', updates)
                    firebase.database().ref().update(updates).then(() => {
                        photos.forEach((imageURL, index) => {
                            firebase.storage().ref().child('images').child(fid).child(index.toString()).put(imageURL).then(snapshot => {

                                firebase.database().ref('reports/' + fid + '/images').push(snapshot.downloadURL)
                            })
                        });

                    }).catch(err => console.error(err));

               });
            window.location.hash = "/";
        }

    }

    handleButtonSelection(category, id){
        switch (category) {
          case "severity":
            //document.getElementById("severity-low").style.border = "none";
            //document.getElementById("severity-medium").style.border = "none";
            //document.getElementById("severity-high").style.border = "none";
            //document.getElementById(id).style.border = "5px solid white";
            switch(id){
              case "severity-low":
                this.setState({
                    sevrBorder: ['5px solid white', 'none', 'none'],
                    sevrPadding: ["5px 0", "10px 0", "10px 0"],
                    sevr: 'Low'
                });
                break;
              case "severity-medium":
                this.setState({
                    sevrBorder: ['none', '5px solid white', 'none'],
                    sevrPadding: ["10px 0", "5px 0", "10px 0"],
                    sevr: 'Medium'
                });
                break;
              case "severity-high":
                this.setState({
                    sevrBorder: ['none', 'none', '5px solid white'],
                    sevrPadding: ["10px 0", "10px 0", "5px 0"],
                    sevr: 'High'
                });
                break;
              default:
                break;
            }
            break;
          case "distribution":
            switch(id){
              case "distribution-uniform":
                this.setState({
                    distBorder: ['5px solid white', 'none'],
                    distPadding: ["5px 0", "10px 0"],
                    dist: 'Uniform'
                });
                break;
              case "distribution-patchy":
                this.setState({
                    distBorder: ['none', '5px solid white'],
                    distPadding: ["10px 0", "5px 0"],
                    dist: 'Patchy'
                });
                break;
              default:
                break;
            }
          default:
            break;
        }
    }

    //Sets the coords state from what it got from the buttton click
    handleLocation(coords){
        this.setState({location: coords});
    }


    //Processes the image selected from user below
    readFile(event, num) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onloadend = () => {
            this.state.images[num] = file;

        }

        reader.onerror = function () {
            alert('There was an error reading the file!');
        }
        reader.readAsDataURL(file);
    }


    render() {
        if (window.File && window.FileReader && window.FormData) {
            var $inputField = this.state.file;


        } else {
            alert("File upload is not supported!");

        }

        var imageTags = this.state.images.map((imageURL, index) => {
            return <img key={index} src={imageURL}/>
        })
        firebase.database().ref('crops/').on('value', snap =>  {
               var data = [];
               snap.forEach(ss => {
                  data.push(ss.child('name').val());
               });
                this.state.list = data;
            })

        return(

            <div className="reports-container">

                <h1>New Report</h1>
                <CropSelect onChange={(term => this.handleSelect('crop', term))} placeholder='Crop' value={this.state.crop} listRef="crops/" required/>

                <GrowthStageSelect onChange={(term => this.handleSelect('gs', term))} placeholder='GrowthStage' value={this.state.gs} crop={this.state.crop}/>

                <br/>

                <PestSelect onChange={(term) => this.handleSelect('pest', term)} placeholder='Pest' value={this.state.pest} crop={this.state.crop} />

                <LocationInput location={this.state.location} onChange={this.handleLocation}></LocationInput>
                <input id="file" type="file" accept="image/*" onChange={(e) =>this.readFile(e,0)}></input>
                <input id="file" type="file" accept="image/*" onChange={(e) =>this.readFile(e,1)}></input>

                <div className="selection-wrap">
                    <p>Severity</p>
                    <div className="selectiion-button select-three select-left" id="severity-low" onClick={() => this.handleButtonSelection("severity", "severity-low")} style={{border: this.state.sevrBorder[0], padding: this.state.sevrPadding[0]}}>Low</div>
                    <div className="selectiion-button select-three" id="severity-medium" onClick={() => this.handleButtonSelection("severity", "severity-medium")} style={{border: this.state.sevrBorder[1], padding: this.state.sevrPadding[1]}}>Med</div>
                    <div className="selectiion-button select-three select-right" id="severity-high" onClick={() => this.handleButtonSelection("severity", "severity-high")} style={{border: this.state.sevrBorder[2], padding: this.state.sevrPadding[2]}}>High</div>
                    <div className="clearfix"></div>
                </div>

                <div className="selection-wrap">
                    <p>Distribution</p>
                    <div className="selectiion-button select-two select-left" id="distribution-uniform" onClick={() => this.handleButtonSelection("distribution", "distribution-uniform")} style={{border: this.state.distBorder[0], padding: this.state.distPadding[0]}}>Uniform</div>
                    <div className="selectiion-button select-two select-right" id="distribution-patchy" onClick={() => this.handleButtonSelection("distribution", "distribution-patchy")} style={{border: this.state.distBorder[1], padding: this.state.distPadding[1]}}>Patchy</div>
                    <div className="clearfix"></div>
                </div>

                <textarea className="text-input" placeholder="Notes: Suggested, how much of field is affected, environmental conditions, notable production practices." name="notes" value={this.state.notes} onChange={this.handleChange}></textarea>

                <button type="submit" onClick={this.handleCreate}>Submit</button>

                {this.state.message}

                <Link className="dashboard-fix" to="/">Go To Dashboard</Link>
            </div>

        )

    }

}

/*
    <label>Distribution:</label>
    <input type="radio" name="dist" value="Uniform" onChange={this.handleChange} className="dist"></input>Uniform
    <input type="radio" name="dist" value="Patchy" onChange={this.handleChange} className="dist"></input>Patchy
    <br/>
    <label>Severity:</label>
    <input type="radio" name="sevr" value="Low" onChange={this.handleChange} className="dist"/>Low
    <input type="radio" name="sevr" value="Medium" onChange={this.handleChange} className="dist"/>Medium
    <input type="radio" name="sevr" value="High" onChange={this.handleChange} className="dist"/>High
*/
