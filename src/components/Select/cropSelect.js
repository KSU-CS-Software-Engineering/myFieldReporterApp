import React, {Component} from 'react';
import * as firebase from 'firebase';

/**********************************
* CropSelect
* Creates a dropdown which displays multiple lists from which can be selected from
***********************************/

export default class CropSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            cList: []
        }
    }
    
    componentWillMount(){
        firebase.database().ref(this.props.listRef).once('value', snapshot => {
          var keys = Object.values(snapshot.val()).map(item => item.name)
          this.setState({cList: keys})
        })
    }
    
    render() {
        var options = this.state.cList.map(item => {
            return <option key={item} value={item}>{item}</option>
        });
        return ( //Render the sugglist
            <select value={this.state.value} onChange={(event)=>this.props.onChange(event.target.value)}><option disabled selected value>Select a Crop</option> {options}</select>
        );
    }
}