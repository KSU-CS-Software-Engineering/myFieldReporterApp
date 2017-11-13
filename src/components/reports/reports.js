import React, {Component} from 'react';
import './reports.css';
import Dashboard from '../dashboard/dashboard';
import SearchableList from '../searchableList/searchableList';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import GeoLocation from '../GeoLocation/GeoLocation';

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
            view: 'current',
            list: [],
            reports: [],
            test: '',
            reportName: ''
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.readFile = this.readFile.bind(this);
        
    }
    
    componentWillMount() {
        
        if(this.props.reportID){
            firebase.database().ref('reports/' + this.props.reportID).once('value').then((snapshot) =>{
               var report = snapshot.val();
                console.log
                this.setState({
                    reportName: report.name,
                    crop: report.crop,
                    gs: report.gs,
                    pest: report.pest,
                    notes: report.notes,
                    time: report.time
                              
                });
                
            });
        }  
    }
    
    
    //Sets the coords state from what it got from the buttton click
    handleLocation(coords){
        console.log(coords);
        this.setState({location: coords});
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
        var fid = firebase.database().ref('reports/').push().key;
        var photos = this.state.images;
        var uid = firebase.auth().currentUser.uid;
        var state = this.state;
        console.log(this.state);
        firebase.database().ref('users/' + uid).once('value').then((snapshot) => {
            var user = snapshot.val();
            var reportCount = 0;
            if(user.reports) reportCount = Object.keys(user.reports).length;
            
             var rName= user.fName.concat(user.lName.concat(reportCount));
              
              var updates = {}
              updates['reports/' + fid] = {
                    crop: state.crop,
                    location: state.location.latitude + "," + state.location.longitude,
                    gs: state.gs,
                    pest: state.pest,
                    notes: state.notes,
                    time: new Date().toJSON(),
                    owner: uid,
                    name: rName
                  }
                updates['users/' + uid + '/reports/' + fid] = true;
            console.log('updates', updates)
                firebase.database().ref().update(updates).then(() => {
                    photos.forEach((imageURL, index) => {
                        firebase.storage().ref().child('images').child(fid).child(index.toString()).put(imageURL).then(snapshot => {

                            firebase.database().ref('reports/' + fid + '/images').push(snapshot.downloadURL)
                        })
                    });

                }).catch(err => console.error(err));

           });
        
        
        
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

                <div className="list-container">
                    <SearchableList onChange={(term) => this.handleSelect('crop', term)} placeholder='Crop' listRef="crops/" value={this.state.crop}/>
                </div>


                <input placeholder="Growth Stage of Crop" name="gs" value={this.state.gs} onChange={this.handleChange} required />

                <br/>

                <input placeholder="Pest" name="pest" value={this.state.pest} onChange={this.handleChange} required />


                <GeoLocation location={this.state.location} onChange={this.handleLocation}></GeoLocation>

                <input id="file" type="file" accept="image/*" onChange={this.readFile}></input>
                <input id="file" type="file" accept="image/*" onChange={this.readFile}></input>

                <input placeholder="Notes" name="notes" value={this.state.notes} onChange={this.handleChange}/>

                <button onClick={this.handleCreate}>Submit</button>

                {this.state.message}

                <Link to="/">Go To Dashboard</Link>
            </div>

        )
    }
    
}
