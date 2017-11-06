import React, {Component} from 'react';
import './dashboard.css';
import * as firebase from 'firebase';
import moment from 'moment';
import Reports from '../reports/reports';
import {Link} from 'react-router-dom';

export default class Dashboard extends Component {

    constructor(props){
        super(props);
        this.state = {
            user: null,
            reports: []
                     }
    
    }
    
    
    componentWillMount() {
        var uid = firebase.auth().currentUser.uid;
        
        firebase.database().ref('reports/').orderByChild('owner').equalTo(uid).once('value').then((snapshot) => {
            var reportData = snapshot.val();
            var reports = [];
            for(var key in reportData) {
                let report = reportData[key];
                report.url = '/reports/' + key;
                reports.push(report);
            }
            this.setState({reports: reports});
            
            
        });
        
    }
        
 
    render(){
        var reps = this.state.reports.reverse();
        var reports = reps.map((item) =>{
            return <a key={item.url} href={item.url}>{item.name} ,{moment(item.time).format('MMMM Do YYYY hh:mm a')}</a> 
        })
        return( 
            <div>
                
            <Link className="create-report-button" to="/reports">Create Report</Link>

            <h1>Your Reports</h1>
            <div className="report-list" style={{display: 'flex', flexDirection: 'column'}}>
                {reports}
            </div>
                
            </div>
        );
    }
    
    
}