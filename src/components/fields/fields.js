import React, {Component} from 'react';
import './fields.css';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';

export default class fields extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return(
            <div>
                <button>Create Field</button>

                <h2>Your Fields</h2>
                <br/>
                <Link to="/">Dashboard</Link>
            </div>
        );
    }
    
}