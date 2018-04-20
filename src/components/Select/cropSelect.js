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
            value: this.props.value,
            cList: []
        }
    }
    
    componentWillMount(){
		
		if(navigator.onLine){
			firebase.database().ref(this.props.listRef).once('value', snapshot => {
			  var keys = Object.values(snapshot.val()).map(item => item.name)
			  localStorage.setItem('crops', JSON.stringify(keys));
			  this.setState({cList: JSON.parse(localStorage.getItem('crops') || "[]")});
			  
			})
			
		}else{
			this.setState({cList: JSON.parse(localStorage.getItem('crops') || "[]")});
		}
    }
    
    componentWillReceiveProps(props){
        this.setState({value: props.value});
    }
    
    render() {
        var options = this.state.cList.map(item => {
            return <option key={item} value={item}>{item}</option>
        });
        return ( //Render the sugglist
            <select value={this.state.value} onChange={(event)=>this.props.onChange(event.target.value)} required>
                <option disabled value=''>Select a Crop</option>{options}
            </select>
        );
    }
}