import React,{Component} from "react";
import './GeoLocation.css';

export default class GeoLocation extends Component{
    constructor(props) {
        super(props);
        this.state = {
            navAvailable: ("geolocation" in navigator),
            errorMessage: '',
            location: ''
        }
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }
    
    getCurrentLocation(){
        console.log('here');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                fetch('https://geo.fcc.gov/api/census/area?lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&format=json').then((res)=> res.json()).then((data) => {
                    console.log(data.results)
                    if(data.results.length == 0){
                        return this.setState({errorMessage: "Location not found."});
                    }
                    this.props.onChange({
                        latitude:position.coords.latitude,
                        longitude: position.coords.longitude,
                        county: data.results[0].county_name,
                        state: data.results[0].state_code
                    });
                }).catch(err=> this.setState({errorMessage: err.message}))
                
            },
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
            latitude: {this.props.location.latitude || ''}
            </div>
            <div className="right-direction">
            longitude: {this.props.location.longitude || ''}
            </div>
          </pre>
          <button onClick={this.getCurrentLocation}>Calculate Position</button>
        </div>
      )
    }
    
}

