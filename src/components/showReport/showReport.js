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
            location: {},
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
                var locs = report.location.split(',');
                this.setState({
                    reportName: report.name,
                    location: locs.map,
                    crop: report.crop,
                    gs: report.gs,
                    pest: report.pest,
                    notes: report.notes,
                    time: report.time
                              
                });
                
            });
        }
           
    }
 
    render(){
        return(
            <div className="reports-container">
                <h1>{this.state.reportName}</h1>
            
                <div className="report-header-wrap">
                    <label className="bold">Submitted:&nbsp;</label>
                    <br/>
                    <label className="bold">Crop:&nbsp;</label>
                    <br/>
                    <label className="bold">Growth Stage:&nbsp;</label>
                    <br/>
                    <label className="bold">Pests:&nbsp;</label>
                    <br/>
                    <label className="bold">Notes:&nbsp;</label>
                </div>
                <div className="report-info-wrap">
                    <div className="hide-overflow">
                        <label>{moment(this.state.time).format('MMM Do YYYY hh:mm a')}</label>
                    </div>
                    <br/>
                    <label>{this.state.crop}</label>
                    <br/>
                    <label>{this.state.gs}</label>
                    <br/>
                    <label>{this.state.pest}</label>
                    <br/>
                    <label>{this.state.notes}</label>
                </div>


                {this.state.message}

                <Link className="dashboard-button" to="/">Go To Dashboard</Link>
            </div>
              );
    }
    
    
}