import React, {Component} from 'react';
import './reports.css';
import Dashboard from '../dashboard/dashboard';
import CropSelect from '../Select/cropSelect';
import PestSelect from '../Select/pestSelect';
import GrowthStageSelect from '../Select/growthstageSelect';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import LocationInput from '../location-input/location-input';
require("firebase/firestore");


//File for the Create Report button. It will bring up all input fields necessary for a report
export default class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: '',         //Crop for report form
            gs: '',           //Growth Stage
            location: {},     //Location, using GeoLocation
            images: [],       //Optional of one or two images
            pest: '',         //Pest that is effecting the crop
            notes: '',        //Extra notes
            list: [],             //List
            reports: [],          //Array of all of users reports
            test: '',             //Unused
            reportName: '',       //Unused
            dist: '',         //Distribution
            sevr: '',         //Severity
            distBg: ["#cbcbcb", "#cbcbcb"],
            sevrBg: ["#cbcbcb", "#cbcbcb", "#cbcbcb"],
            distColor: ["#ffffff", "#ffffff"],
            sevrColor: ["#ffffff", "#ffffff", "#ffffff"],
            required: ["none", "none", "none", "none", "none", "none"],
            displaySelection: "none"
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonSelection = this.handleButtonSelection.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.readFile = this.readFile.bind(this);

    }


    //Change state values with whatever was entered. if crop is the name, crop value will be changed.
    //Currently only used for the Notes. Since Notes is the event it's called in, the name and value will be taken from there.
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }


    handleSelect(name, value){ //Change a specific state with a specific value. Used in searchableList
        this.setState({
            [name]: value,
            displaySelection: "block"
        });

    }

    //Creates the entry for the database from the state objects when submit is clicked.
    //TODO: Shouldn't be able to submit if there is any information
    handleCreate(){
        var require = ["none", "none", "none", "none", "none", "none"];
        var valid = true;
        if(this.state.crop == ''){
            valid = false;
            require[0] = "block";
        }
        if(this.state.gs == ''){
            valid = false;
            require[1] = "block";
        }
        if(this.state.pest == ''){
            valid = false;
            require[2] = "block";
        }
        if(this.state.location.latitude == undefined && this.state.location.county == undefined){
            valid = false;
            require[3] = "block";
        }
        if(this.state.dist == ''){
            valid = false;
            require[4] = "block";
        }
        if(this.state.sevr == ''){
            valid = false;
            require[5] = "block";
        }
        this.setState({
            required: require
        });
        if(valid){
            var fid = firebase.database().ref('reports/').push().key;
            var photos = this.state.images;
            var uid = firebase.auth().currentUser.uid;
            var state = this.state;
            firebase.database().ref('users/' + uid).once('value').then((snapshot) => { //Inside the users tree in the database...
                var user = snapshot.val();
                var reportCount = 0;
                if(user.reports) reportCount = Object.keys(user.reports).length; //Get the last spot

                 var rName= user.fName.concat(user.lName.concat(" " + (reportCount+1))); //Report name

                  var updates = {}
                  updates['reports/' + fid] = { //Populate report
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
                    firebase.database().ref().update(updates).then(() => { //Handle uploading the images, if any
                        photos.forEach((imageURL, index) => {
                            firebase.storage().ref().child('images').child(fid).child(index.toString()).put(imageURL).then(snapshot => {
                                //(imageURL);
                                firebase.database().ref('reports/' + fid + '/images').push(snapshot.downloadURL)
                            })
                        });

                    }).then(() => {
                      window.location.hash = "/";
                    }).catch(err => console.error(err));
               });
        }

    }

    //Buttons Selection for the Severity and Distribution radio buttons.
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
                    sevrBg: ['#ffffff', '#cbcbcb', '#cbcbcb'],
                    sevrColor: ["#cbcbcb", "#ffffff", "#ffffff"],
                    sevr: 'Low'
                });
                break;
              case "severity-medium":
                this.setState({
                    sevrBg: ['#cbcbcb', '#ffffff', '#cbcbcb'],
                    sevrColor: ["#ffffff", "#cbcbcb", "#ffffff"],
                    sevr: 'Medium'
                });
                break;
              case "severity-high":
                this.setState({
                    sevrBg: ['#cbcbcb', '#cbcbcb', '#ffffff'],
                    sevrColor: ["#ffffff", "#ffffff", "#cbcbcb"],
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
                    distBg: ['#ffffff', '#cbcbcb'],
                    distColor: ["#cbcbcb", "#ffffff"],
                    dist: 'Uniform'
                });
                break;
              case "distribution-patchy":
                this.setState({
                    distBg: ['#cbcbcb', '#ffffff'],
                    distColor: ["#ffffff", "#cbcbcb"],
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



    //Renders the option. Everything is created here.
    render() {
        if (window.File && window.FileReader && window.FormData) {
            var $inputField = this.state.file;


        } else {
            alert("File upload is not supported!");

        }

        var imageTags = this.state.images.map((imageURL, index) => {
            return <img key={index} src={imageURL}/>
        })


        if(this.state.crop){
          var gsSelect = <GrowthStageSelect onChange={(term => this.handleSelect('gs', term))} placeholder='GrowthStage' value={this.state.gs} crop={this.state.crop} crops={this.props.crops} />
          var pSelect = <PestSelect onChange={(term) => this.handleSelect('pest', term)} placeholder='Pest' value={this.state.pest} crop={this.state.crop} crops={this.props.crops} />
        }else{
          gsSelect = null
          pSelect = null
        }
        return(

            <div className="reports-container">

                <h1>New Report</h1>
                <div className="message" style={{display: this.state.required[0]}}>* Crop is a required</div>
                <CropSelect onChange={(term => this.handleSelect('crop', term))} placeholder='Crop' value={this.state.crop} listRef="crops/"  crops={this.props.crops} required/>


                <div className="display-after-crop-selection" style={{display: this.state.displaySelection}}>
                    <div className="message" style={{display: this.state.required[1]}}>* Growth Stage is a required</div>
                    {gsSelect}
                    <br/>
                    <div className="message" style={{display: this.state.required[2]}}>* Pest is a required</div>
                    {pSelect}
                    </div>

                <div className="message" style={{display: this.state.required[3]}}>* Location is a required</div>
                <LocationInput location={this.state.location} onChange={this.handleLocation}></LocationInput>
                <input id="file" type="file" accept="image/*" onChange={(e) =>this.readFile(e,0)}></input>
                <input id="file" type="file" accept="image/*" onChange={(e) =>this.readFile(e,1)}></input>

                <div className="message" style={{display: this.state.required[4]}}>* Severity is a required</div>
                <div className="selection-wrap">
                    <p>Severity</p>
                    <div className="selection-button select-three select-left" id="severity-low" onClick={() => this.handleButtonSelection("severity", "severity-low")} style={{backgroundColor: this.state.sevrBg[0], color: this.state.sevrColor[0]}}>Low</div>
                    <div className="selection-button select-three" id="severity-medium" onClick={() => this.handleButtonSelection("severity", "severity-medium")} style={{backgroundColor: this.state.sevrBg[1], color: this.state.sevrColor[1]}}>Med</div>
                    <div className="selection-button select-three select-right" id="severity-high" onClick={() => this.handleButtonSelection("severity", "severity-high")} style={{backgroundColor: this.state.sevrBg[2], color: this.state.sevrColor[2]}}>High</div>
                    <div className="clearfix"></div>
                </div>

                <div className="message" style={{display: this.state.required[5]}}>* Distribution is a required</div>
                <div className="selection-wrap">
                    <p>Distribution</p>
                    <div className="selection-button select-two select-left" id="distribution-uniform" onClick={() => this.handleButtonSelection("distribution", "distribution-uniform")} style={{backgroundColor: this.state.distBg[0], color: this.state.distColor[0]}}>Uniform</div>
                    <div className="selection-button select-two select-right" id="distribution-patchy" onClick={() => this.handleButtonSelection("distribution", "distribution-patchy")} style={{backgroundColor: this.state.distBg[1], color: this.state.distColor[1]}}>Patchy</div>
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
