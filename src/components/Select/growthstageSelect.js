import React, {Component} from 'react';
import * as firebase from 'firebase';

/**********************************
* GrowthStageSelect
* Creates a dropdown which displays multiple lists from which can be selected from
***********************************/

export default class GrowthStageSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: props.value,
            cList: []
        }
    }
    
    componentWillReceiveProps(props){
        var refr = "crops/" + props.crop.toLowerCase() + "/growthStages"
        firebase.database().ref(refr).once('value', snapshot => {
            if (!snapshot.exists()) return;
            var keys = Object.values(snapshot.val()).map(item => item.name)
            this.setState({cList: keys, value: props.value});
        })
    }
    
    render() {
        var options = this.state.cList.map(item => {
            return <option key={item} value={item}>{item}</option>
        });
        return ( //Render the sugglist
            <select value={this.state.value} onChange={(event)=>this.props.onChange(event.target.value)}>
                <option disabled value=''>Select the Growth Stage</option>
                {options}
            </select>
        );
    }
}