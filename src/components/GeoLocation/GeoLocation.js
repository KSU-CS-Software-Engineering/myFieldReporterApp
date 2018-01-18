import React,{Component} from "react";
import './GeoLocation.css';

export default class GeoLocation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            navAvailable: ("geolocation" in navigator),
            errorMessage: ''
        }
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }
    
    getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            (position) => {this.props.onChange(position.coords);},
            (err) => {this.setState({errorMessage: err.message})}
        );
    }
    
    render(){
        if(!this.state.navAvailable) return (<pre>GPS not available on this device</pre>)
        return (
        <div className="geolocation-wrap">
          {this.state.errorMessage}
          <pre>
            <div className="left-direction">
            latitude: {this.props.location.latitude}
            </div>
            <div className="right-direction">
            longitude: {this.props.location.longitude}
            </div>
          </pre>
          <button onClick={this.getCurrentLocation}>Calculate Position</button>
        </div>
      )
    }
    
}

