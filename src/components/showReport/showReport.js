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
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Submitted:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{moment(this.state.time).format('MMM Do YYYY hh:mm a')}</label>
                    </div>
                </div>
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Crop:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.crop}</label>
                    </div>
                </div>
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Growth Stage:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.gs}</label>
                    </div>
                </div>
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Pests:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.pest}</label>
                    </div>
                </div>
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Notes:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.notes}</label>
                    </div>
                </div>
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Location:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.location}</label>
                    </div>
                </div>
                <img src={this.state.images}></img>

                {this.state.message}

                <Link to="/">Go To Dashboard</Link>
            </div>
              );
    }
    
    
}