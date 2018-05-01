import React, {Component} from 'react';
import './showReport.css';
import * as firebase from 'firebase';
import moment from 'moment';
import Reports from '../reports/reports';
import {Route, Link} from 'react-router-dom';

export default class showReport extends Component {

    constructor(props){
        super(props);
        this.state = {
            crop: '',
            gs: '',
            location: '',
            images: {},
            pest: '',
            notes: '',
            view: 'current',
            list: [],
            reports: [],
            time: '',
            reportName: '',
            dist: ''
        }

        this.handleEdit = this.handleEdit.bind(this);

    }

    componentWillMount() {

        if(this.props.reportID){
            firebase.database().ref('reports/' + this.props.reportID).once('value').then((snapshot) =>{
               var report = snapshot.val();
                this.setState({
                    reportName: report.name,
                    location: report.location,
                    crop: report.crop,
                    gs: report.gs,
                    pest: report.pest,
                    notes: report.notes,
                    time: report.time,
                    images: report.images,
                    dist: report.dist,
                    sevr: report.sevr

                });
            });
        }
    }

    handleEdit(){
        window.location.hash = "/reports/" + this.props.reportID;
    }

    render(){

        if(this.state.images){
           var pics = Object.values(this.state.images);
           var i =-1;
           var pictures = pics.map((item) =>{
                i++;
                return <img key={i} className="pictures" src={item}></img>
            })
        }

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
                        <label className="bold">Distribution:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.dist}</label>
                    </div>
                </div>
                <div className="report-section-wrap">
                    <div className="report-header-wrap">
                        <label className="bold">Severity:&nbsp;</label>
                    </div>
                    <div className="report-info-wrap">
                        <label>{this.state.sevr}</label>
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
                        <label>{this.state.location.county + ", " + this.state.location.state}</label>
                    </div>
                </div>
                <div>
                    {pictures}
                </div>

                {this.state.message}

                <Link className="edit-button" to={"/reports/"+this.props.reportID + "/edit"}>Edit Report</Link>

                <Link className="dashboard-fix" to="/">Go To Dashboard</Link>
            </div>
              );
    }


}
