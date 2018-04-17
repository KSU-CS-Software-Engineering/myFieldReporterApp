import React, {Component} from 'react';
import './location-input.css';
import * as firebase from 'firebase';
import moment from 'moment';
import GeoLocation from '../GeoLocation/GeoLocation';

export default class LocationInput extends Component {

    constructor(props){
        super(props);
        this.state = {
            gps: 'none',
            type: 'none',
            county: '',
            state: '',
            locBg: ["#cbcbcb", "#cbcbcb"],
            locColor: ["#ffffff","#ffffff"]
        }
        this.changeDisplay = this.changeDisplay.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

      //Change state values with whatever was entered.
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
        console.log(this.state.county + ", " + this.state.state);
        this.props.onChange({
                        county: this.state.county,
                        state: this.state.state,
                        latitude: null,
                        longitude: null
                    })
        })

    }

    changeDisplay(name){
        switch(name){
            case 'gps':
                this.setState({
                    gps: 'block',
                    type: 'none',
                    locBg: ['#ffffff', '#cbcbcb'],
                    locColor: ["#cbcbcb", "#ffffff"]
                });
                break;
            case 'type':
                this.setState({
                    gps: 'none',
                    type: 'block',
                    locBg: ['#cbcbcb', '#ffffff'],
                    locColor: ["#ffffff", "#cbcbcb"]
                });
                break;
         };
    }

    render(){
        return(
            <div className="location-wrap">
                <p>Location</p>
                <button className="content-within" onClick={() => this.changeDisplay('gps')} style={{backgroundColor: this.state.locBg[0], color: this.state.locColor[0]}}>Use GPS</button>
                <button className="content-within float-right" onClick={() => this.changeDisplay('type')} style={{backgroundColor: this.state.locBg[1], color: this.state.locColor[1]}}>Manual</button>
                <div className="gps-location" style={{display: this.state.gps}}>
                    <GeoLocation location={this.props.location} onChange={this.props.onChange} required ></GeoLocation>
                </div>
                <div className="give-location" style={{display: this.state.type}}>
                    <p>
                        <input className="content-within county" name="county" placeholder="County" value={this.state.county} onChange={this.handleChange}></input>
                        <input className="content-within float-right state" name="state" placeholder="State" value={this.state.state} onChange={this.handleChange}></input>
                    </p>
                </div>
                <div className="clearfix"></div>
            </div>
              );
    }


}
