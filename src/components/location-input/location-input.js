import React, {Component} from 'react';
import './location-input.css';
import * as firebase from 'firebase';
import moment from 'moment';
import GeoLocation from '../GeoLocation/GeoLocation';

export default class LocationInput extends Component {

    constructor(props){
        super(props);
        this.state = {
            location: '',
            gps: 'block',
            type: 'none'
        }
        this.handleLocation = this.handleLocation.bind(this);
        this.changeDisplay = this.changeDisplay.bind(this);
    }

    //Sets the coords state from what it got from the buttton click
    handleLocation(coords){
        console.log(coords);
        this.setState({location: coords});
    }

    changeDisplay(name){
        switch(name){
            case 'gps':
                this.setState({
                    gps: 'block',
                    type: 'none'
                });
                break;
            case 'type':
                this.setState({
                    gps: 'none',
                    type: 'block'
                });
                break;
         };
    }

    render(){
        return(
            <div className="location-wrap">
                <button onClick={() => this.changeDisplay('gps')}>Use GPS</button>
                <button className="float-right" onClick={() => this.changeDisplay('type')}>Manual</button>

                <div className="gps-location" style={{display: this.state.gps}}>
                    <GeoLocation location={this.state.location} onChange={this.handleLocation} required ></GeoLocation>
                </div>
                <div className="give-location" style={{display: this.state.type}}>
                    <p>
                        <input className="county" placeholder="County"></input>
                        <input className="state" placeholder="State"></input>
                    </p>
                </div>
            </div>
              );
    }


}
