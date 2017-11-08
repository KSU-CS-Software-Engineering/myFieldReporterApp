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
            test: '',
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
                              
                });
                
            });
        }
           
    }
 
    render(){
        return(
            <div className="reports-container">
                <h1>New Report</h1>

             
                <label> Crop:</label>
                <label className="bold">{this.state.crop}</label>
                

                <label/>

                <br/>

                <label placeholder="Pest" name="pest" value={this.state.pest} onChange={this.handleChange} required />



                <label placeholder="Notes" name="notes" value={this.state.notes} onChange={this.handleChange}/>


                {this.state.message}

                <Link className="dashboard-button" to="/">Go To Dashboard</Link>
            </div>
              );
    }
    
    
}