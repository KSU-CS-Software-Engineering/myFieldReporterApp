import React, {Component} from 'react';
import './editReport.css';
import Dashboard from '../dashboard/dashboard';
import CropSelect from '../Select/cropSelect';
import PestSelect from '../Select/pestSelect';
import GrowthStageSelect from '../Select/growthstageSelect';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';

export default class editReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: '',
            gs: '',
            location: '',
            images: [],
            pest: '',
            notes: '',
            view: 'current',
            list: [],
            reports: [],
            test: '',
            reportName: '',
            reportID: '',
            dist: '',
            sevr: ''
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.readFile = this.readFile.bind(this);

    }

    componentWillMount() {

        if(this.props.reportID){
            firebase.database().ref('reports/' + this.props.reportID).once('value').then((snapshot) =>{
               var report = snapshot.val();
                console.log
                this.setState({
                    reportID: this.props.reportID,
                    reportName: report.name,
                    crop: report.crop,
                    gs: report.gs,
                    pest: report.pest,
                    notes: report.notes,
                    time: report.time,
                    images: report.images,
                    location: report.location,
                    dist: report.dist,
                    sevr: report.sevr

                });

            });
        }
    }


    //Change state values with whatever was entered. if crop is the name, crop value will be changed.
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    //Change a specific state with a specific value. Used in searchableList
    handleSelect(name, value){
        this.setState({[name]: value})
    }

    //Creates the entry for the database from the state objects when submit is clicked
    handleCreate(){
        var photos = this.state.images;
        var uid = firebase.auth().currentUser.uid;
        var state = this.state;
              var updates = {}
              updates['reports/' + this.state.reportID] = {
                    crop: state.crop,
                    gs: state.gs,
                    pest: state.pest,
                    notes: state.notes,
                    time: new Date().toJSON(),
                    owner: uid,
                    name: this.state.reportName,
                    location: state.location,
                    dist: state.dist,
                    sevr: state.sevr,
                     //images: state.images //Keep edited out until implement ability to change images
                  }
                updates['users/' + uid + '/reports/' + this.props.reportID] = true;
                console.log('updates', updates);
                firebase.database().ref().update(updates);

        this.setState({
            crop: '',
            gs: '',
            location: '',
            images: [],
            pest: '',
            notes: '',
            view: 'current',
            list: []
        })


    }


    //Processes the image selected from user below
    readFile(event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onloadend = () => {
            this.state.images[this.state.images.length] = file;

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


        firebase.database().ref('crops/').on('value', snap =>  {
               var data = [];
               snap.forEach(ss => {
                  data.push(ss.child('name').val());
               });
                this.state.list = data;
            })

        return(

            <div className="reports-container">
                <h1>{this.state.reportName}</h1>

                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Crop:&nbsp;</label>
                        <label className="bold">Growth Stage:&nbsp;</label>
                        <label className="bold">Pest:&nbsp;</label>
                        <label className="bold">Distribution:&nbsp;</label>
                        <label className="bold">Severity:&nbsp;</label>
                        <label className="bold">Notes:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <CropSelect onChange={(term => this.handleSelect('crop', term))} placeholder='Crop' value={this.state.crop} listRef="crops/" />
                        <GrowthStageSelect onChange={(term => this.handleSelect('gs', term))} placeholder='GrowthStage' value={this.state.gs} crop={this.state.crop} />
                        <PestSelect onChange={(term) => this.handleSelect('pest', term)} placeholder='Pest' value={this.state.pest} crop={this.state.crop}/>
                        <input type="radio" name="dist" value="Uniform" onChange={this.handleChange} className="dist"></input>Uniform
                        <input type="radio" name="dist" value="Patchy" onChange={this.handleChange} className="dist"></input>Patchy
                        <br/>
                        <input type="radio" name="sevr" value="Low" onChange={this.handleChange} className="dist"/>Low
                        <input type="radio" name="sevr" value="Medium" onChange={this.handleChange} className="dist"/>Medium
                        <input type="radio" name="sevr" value="High" onChange={this.handleChange} className="dist"/>High
                        <textarea className="text-input" placeholder="Notes: Suggested, how much of field is affected, environmental conditions, notable production practices." name="notes" value={this.state.notes} onChange={this.handleChange}></textarea>
                    </div>
                </div>

                <br/>

                <button onClick={this.handleCreate}>Submit</button>

                {this.state.message}

                <Link className="dashboard-fix" to="/">Go To Dashboard</Link>
            </div>

        )
    }

}
