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
