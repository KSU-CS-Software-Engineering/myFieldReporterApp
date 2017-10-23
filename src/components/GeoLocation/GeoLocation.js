import React,{Component} from "react";

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
        <div>
          <button onClick={this.getCurrentLocation}>Get Position</button>
          {this.state.errorMessage}
          <pre>
            latitude: {this.props.location.latitude}
              <br/>
            longitude: {this.props.location.longitude}
          </pre>
        </div>
      )
    }
    
}

