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

        firebase.database().ref(`/users/${uid}/reports`).once('value').then((snapshot) => {
          var rids = snapshot.val();
          
          var promises = [];
          for(var key in rids) {
            promises.push(
              firebase.database().ref(`reports/${key}`).once('value')
            );
          }
          Promise.all(promises).then(snapshots => {
            var reports = snapshots.map(snapshot => {
              var report = snapshot.val();
              report.url = '/reports/' + snapshot.key;
              return report;
            });
            this.setState({reports: reports});
          });
        });
    }


    render(){
        var reps = this.state.reports.reverse();
        var reports = reps.map((item) =>{
            return <Link key={item.name} to={item.url}><div className="line"></div><div className="report-name">{item.name}</div> <div>Crop: {item.crop}</div> <div>Pest: {item.pest}</div> {moment(item.time).format('MMMM Do YYYY hh:mm a')}</Link>
        })
        return(
            <div className="dashboard-container">

                <Link className="create-report-button" to="/reports">New Report</Link>

                <h1>Past Reports</h1>

                <div className="report-list" style={{display: 'flex', flexDirection: 'column'}}>
                    {reports}
                </div>
                <div className="line"></div>

            </div>
        );
    }


}
