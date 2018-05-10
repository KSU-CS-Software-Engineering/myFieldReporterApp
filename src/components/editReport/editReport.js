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
            image: [],
            pest: '',
            notes: '',
            view: 'current',
            list: [],
            reports: [],
            test: '',
            reportName: '',
            reportID: '',
            dist: '',
            sevr: '',
            distBg: ["#cbcbcb", "#cbcbcb"],
            sevrBg: ["#cbcbcb", "#cbcbcb", "#cbcbcb"],
            distColor: ["#ffffff", "#ffffff"],
            sevrColor: ["#ffffff", "#ffffff", "#ffffff"]
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleButtonSelection=this.handleButtonSelection.bind(this);
        this.readFile = this.readFile.bind(this);

    }

    componentWillMount() {
        if(this.props.reportID){
            firebase.database().ref('reports/' + this.props.reportID).once('value').then((snapshot) =>{
               var report = snapshot.val();

               if(this.state.image){
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
              }else{
                  this.setState({
                      reportID: this.props.reportID,
                      reportName: report.name,
                      crop: report.crop,
                      gs: report.gs,
                      pest: report.pest,
                      notes: report.notes,
                      time: report.time,
                      location: report.location,
                      dist: report.dist,
                      sevr: report.sevr
                  });
                }

            });

        }

        if(this.state.dist='uniform'){
          this.handleButtonSelection("distribution", "distribution-uniform")
        }else{
          this.handleButtonSelection("distribution", "distribution-patchy")
        }

        if(this.state.sevr = 'Low'){
          this.handleButtonSelection("severity", "severity-low")
        } else if(this.state.sevr = 'Medium'){
          this.handleButtonSelection("severity", "severity-medium")
        }else{
          this.handleButtonSelection("severity", "severity-high")
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

    //Creates the entry for the database from the state objects when submit is clicked
    handleCreate(){

      var photos = this.state.image;
      var uid = firebase.auth().currentUser.uid;
      var fid = this.props.reportID;
      var state = this.state;
      var updates = {}
      updates['reports/' + fid] = {
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

    }

      updates['users/' + uid + '/reports/' + fid] = true;
      firebase.database().ref().update(updates).then(()=>{

        photos.forEach((imageURL, index) => {
            firebase.storage().ref().child('images').child(fid).child(index.toString()).put(imageURL).then(snapshot => {
                //(imageURL);
                firebase.database().ref('reports/' + fid + '/images').push(snapshot.downloadURL)
            })
        });

      }).then(()=>{window.location= "/#";}).catch(err => console.error(err));

      //window.location= "/#/reports/"+fid;

    }


    //Processes the image selected from user below
    readFile(event, num) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onloadend = () => {
          this.state.image[num] = file;
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

        var imgUpload="";
        var imgUpload2="";
        if(!this.state.images){
          var imgUpload = <input id="file" type="file" accept="image/*" onChange={(e) =>this.readFile(e,0)}></input>;
          var imgUpload2 = <input id="file" type="file" accept="image/*" onChange={(e) =>this.readFile(e,1)}></input>;
        }




        if(this.state.crop){
          var gsSelect = <GrowthStageSelect onChange={(term => this.handleSelect('gs', term))} placeholder='GrowthStage' value={this.state.gs} crop={this.state.crop} crops={this.props.crops}/>
          var pSelect = <PestSelect onChange={(term) => this.handleSelect('pest', term)} placeholder='Pest' value={this.state.pest} crop={this.state.crop} crops={this.props.crops}/>
        }else{
          gsSelect = null
          pSelect = null
        }

        return(

            <div className="reports-container">
                <h1>{this.state.reportName}</h1>

                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Crop:&nbsp;</label>
                        <label className="bold">Growth Stage:&nbsp;</label>
                        <label className="bold">Pest:&nbsp;</label>
                        <label className="bold edit-dist-space">Distribution:&nbsp;</label>
                        <label className="bold edit-sevr-space">Severity:&nbsp;</label>
                        <label className="bold">Notes:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <CropSelect onChange={(term => this.handleSelect('crop', term))} placeholder='Crop' value={this.state.crop} listRef="crops/" crops={this.props.crops}/>
                        {gsSelect}
                        {pSelect}
                      <div className="selection-wrap">
                            <div className="selection-button " id="severity-low" onClick={() => this.handleButtonSelection("severity", "severity-low")} style={{backgroundColor: this.state.sevrBg[0], color: this.state.sevrColor[0]}}>Low</div>
                            <div className="selection-button " id="severity-medium" onClick={() => this.handleButtonSelection("severity", "severity-medium")} style={{backgroundColor: this.state.sevrBg[1], color: this.state.sevrColor[1]}}>Med</div>
                            <div className="selection-button " id="severity-high" onClick={() => this.handleButtonSelection("severity", "severity-high")} style={{backgroundColor: this.state.sevrBg[2], color: this.state.sevrColor[2]}}>High</div>
                            <div className="clearfix"></div>
                        </div>
                        <div className="selection-wrap">
                            <div className="selection-button " id="distribution-uniform" onClick={() => this.handleButtonSelection("distribution", "distribution-uniform")} style={{backgroundColor: this.state.distBg[0], color: this.state.distColor[0]}}>Uniform</div>
                            <div className="selection-button " id="distribution-patchy" onClick={() => this.handleButtonSelection("distribution", "distribution-patchy")} style={{backgroundColor: this.state.distBg[1], color: this.state.distColor[1]}}>Patchy</div>
                            <div className="clearfix"></div>
                        </div>
                        <textarea className="text-input" placeholder="Notes: Suggested, how much of field is affected, environmental conditions, notable production practices." name="notes" value={this.state.notes} onChange={this.handleChange}></textarea>


                    </div>
                    {imgUpload}
                    {imgUpload2}
                </div>

                <br/>

                <button onClick={this.handleCreate}>Submit</button>

                {this.state.message}

                <Link className="dashboard-fix" to="/">Go To Dashboard</Link>
            </div>

        )
    }

}
