import React, {Component} from 'react';
import './loading.css';
import logo from '../../logo.png';


//File for the Create Report button. It will bring up all input fields necessary for a report
export default class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }


    }

render(){
        return(

            <div className="loading-container">
                <div className="align-helper"></div>
                <img src={logo} alt="logo" />
            </div>

        )

    }

}

/*
    <label>Distribution:</label>
    <input type="radio" name="dist" value="Uniform" onChange={this.handleChange} className="dist"></input>Uniform
    <input type="radio" name="dist" value="Patchy" onChange={this.handleChange} className="dist"></input>Patchy
    <br/>
    <label>Severity:</label>
    <input type="radio" name="sevr" value="Low" onChange={this.handleChange} className="dist"/>Low
    <input type="radio" name="sevr" value="Medium" onChange={this.handleChange} className="dist"/>Medium
    <input type="radio" name="sevr" value="High" onChange={this.handleChange} className="dist"/>High
*/
