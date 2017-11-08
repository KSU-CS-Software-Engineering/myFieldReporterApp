import React, {Component} from 'react';
import './showReport.css';
import * as firebase from 'firebase';
import moment from 'moment';
import Reports from '../reports/reports';
import {Link} from 'react-router-dom';

export default class showReport extends Component {

    constructor(props){
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
            time: '',
            reportName: ''
        }
    
    }
 
    componentWillMount() {
        
        if(this.props.reportID){
            firebase.database().ref('reports/' + this.props.reportID).once('value').then((snapshot) =>{
               var report = snapshot.val();
                console.log
                this.setState({
                    reportName: report.name,
                    location: report.location,
                    crop: report.crop,
                    gs: report.gs,
                    pest: report.pest,
                    notes: report.notes,
                    time: report.time,
                    images: report.images
                              
                });
                
            });
        }
         console.log(this.state.images);  
    }
 
    render(){
        return(
            <div className="reports-container">
                <h1>{this.state.reportName}</h1>

                
                <label className="bold">Submitted: </label>
                <label>{moment(this.state.time).format('MMM Do YYYY hh:mm a')}</label>
                
                
                <br/>
                <label className="bold">Crop: </label>
                <label>{this.state.crop}</label>
                
                <br/>
                <label className="bold">Growth Stage: </label>
                <label>{this.state.gs}</label>

                <br/>
                <label className="bold">Pests: </label>
                <label>{this.state.pest}</label>
                
                <br/>
                <label className="bold">Notes: </label>
                <label>{this.state.notes}</label>
                
                <br/>
                <label className="bold">Location: </label>
                <label>{this.state.location}</label>
                
                <img src={this.state.images}></img>

                {this.state.message}

                <Link className="dashboard-button" to="/">Go To Dashboard</Link>
            </div>
              );
    }
    
    
}